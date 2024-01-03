import {AuthResponse, AuthTokenResponse, createClient, UserResponse} from '@supabase/supabase-js'
import 'dotenv/config'
import {logger} from '../server'
import {AuthUserRequest} from '../models/authUserRequest'
import {NewPasswordRequest} from '../models/newPasswordRequest'
import {CreateUserRequest} from "../models/createUserRequest";

const supabase = createClient("http://localhost:54321", process.env.AUTH_KEY || "")

export interface UserAuth {
    access_token: string | null
    payload: {
        name: string,
        email: string,
        id: string
    } | null;
}

export class AuthService {

    public static async signUpNewUser(request: CreateUserRequest, userId: number): Promise<UserAuth> {
        const response = await supabase.auth.signUp({
            email: request.email,
            password: request.password,
            options: {
                data: {
                    email: request.email,
                    name: request.name,
                    id: userId
                }
            }
        })
        if (response.error != undefined) {
            throw new Error(response.error.message)
        }
        return this.parseSupabaseTokenResponse(response)
    }

    public static async deleteUser(id: string) {
        logger.info("Deleting user with id " + id + " from auth table")
        const { data, error } = await supabase.auth.admin.deleteUser(id)
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    //TODO: mejorar el catcheo de error -> no pude hacer lo que queria
    public static async updatePassword(request: NewPasswordRequest) {
        const { data, error } = await supabase.auth.updateUser({ password: request.password })
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    public static async signInWithPassword(request: AuthUserRequest) {
        const response = await supabase.auth.signInWithPassword({
            email: request.email,
            password: request.password,
        })
        if (response.error != null) {
            throw new Error(response.error.message)
        }
        return this.parseSupabaseTokenResponse(response)
    }

    public static async getLoggedUser(token: string): Promise<UserResponse> {
        const response = await supabase.auth.getUser(token)
        if (response.error != undefined) {
            throw new Error(response.error.message)
        }
        return response
    }

    public static async signOutUser() {
        const { error } = await supabase.auth.signOut()
        if (error != null)
            throw new Error(error.message)
    }

    private static parseSupabaseTokenResponse(object: AuthTokenResponse | AuthResponse): UserAuth {
        return {
            access_token: object.data.session?.access_token ?? null,
            payload: {
                id: object.data.user?.user_metadata.id as string,
                email: object.data.user?.user_metadata.email as string,
                name: object.data.user?.user_metadata.name as string
            }
        };
    }
}