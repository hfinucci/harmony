import { createClient, UserResponse } from "@supabase/supabase-js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../server";
import { AuthUserRequest } from "../models/authUserRequest";
import { NewPasswordRequest } from "../models/newPasswordRequest";
import { UserPersistence } from "../persistence/userPersistence";
import { AuthenticationError } from "../models/errors/AuthenticationError";

// const supabase = createClient("http://localhost:54321", process.env.AUTH_KEY || "")

export interface UserAuth {
    access_token: string;
    person: Person;
}

export interface Person {
    id: number;
    name: string;
    email: string;
}

export class AuthService {
    public static async generateHashedPassword(
        password: string
    ): Promise<string> {
        const saltRounds = 10; // Cost factor for the bcrypt algorithm
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error("Error while registering user");
        }
    }

    public static async login(
        request: AuthUserRequest
    ): Promise<UserAuth | null> {
        try {
            const user = await UserPersistence.getUserByEmail(request.email);
            const match = await bcrypt.compare(request.password, user.password);
            if (!match) {
                throw new AuthenticationError("Invalid password");
            }
            delete user.password;
            const person = { ...user } as Person;
            return {
                access_token: this.generateJWT(person),
                person: person,
            };
        } catch (error) {
            logger.error(error);
            throw new AuthenticationError("Error while authenticating user");
        }
    }

    public static generateJWT(user: Person) {
        try {
            return jwt.sign(user, process.env.JWTSecretKey || "", {
                expiresIn: "1y",
            });
        } catch (error) {
            throw new AuthenticationError("Error while generating JWT");
        }
    }

    public static async updatePassword(
        request: NewPasswordRequest,
        userAuth: UserAuth
    ) {
        const hashedPassword = await this.generateHashedPassword(
            request.password
        );
        return await UserPersistence.updatePasswordById(
            userAuth.person.id,
            hashedPassword
        );
    }

    public static parseJWT(bearerAuth?: string): UserAuth {
        if (bearerAuth == null) {
            throw new AuthenticationError("No token provided");
        }
        const token = bearerAuth.split(" ")[1];
        const jwtParts = token.split(".");
        if (jwtParts.length !== 3) {
            throw new AuthenticationError("Invalid token");
        }
        let payload;
        try {
            payload = JSON.parse(atob(jwtParts[1]));
        } catch (error) {
            logger.error(error);
            throw new AuthenticationError("Could not authenticate token");
        }
        if (payload == null) {
            throw new AuthenticationError("No user metadata found");
        }
        const person = this.validateJWT(token);
        return { access_token: token, person: person };
    }

    public static validateJWT(token: string): Person {
        try {
            return jwt.verify(token, process.env.JWTSecretKey || "") as Person;
        } catch (error) {
            throw new AuthenticationError("Invalid token");
        }
    }
}
