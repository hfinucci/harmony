import { QueryResult } from "pg";
import { dbpool } from "./dbConfig";
import { logger } from "../server";

export class UserPersistence {
    public static async getUserName(userId: number): Promise<string | null> {
        const query = {
            text: "SELECT name FROM users WHERE id = $1",
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0]?.name ?? null;
    }

    public static async updatePasswordById(userId: number, password: string) {
        const query = {
            text: "UPDATE users SET password = $1 WHERE id = $2",
            values: [password, userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rowCount != 0;
    }

    public static async getUserById(userId: number) {
        const query = {
            text: "SELECT * FROM users WHERE id = $1",
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async getUserByEmail(email: string) {
        const query = {
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async getUserWithAuthId(
        auth_id: string
    ): Promise<object | null> {
        const query = {
            text: "SELECT * FROM users WHERE auth_id = $1",
            values: [auth_id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async getAuthId(userId: number): Promise<string | null> {
        const query = {
            text: "SELECT auth_id FROM users WHERE id = $1",
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async createUser(
        email: string,
        name: string,
        hashedPassword: string
    ) {
        const query = {
            text: "INSERT INTO users (email, name, password, image) VALUES ($1, $2, $3, $4) RETURNING (id)",
            values: [email, name, hashedPassword, "cow.png"],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async deleteUserById(id: number): Promise<boolean | null> {
        const query = {
            text: "DELETE FROM users WHERE id = $1;",
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rowCount != 0;
    }

    public static async changeImg(
        id: number,
        url: string
    ): Promise<boolean | null> {
        const query = {
            text: "UPDATE users SET image = $1 WHERE id = $2",
            values: [url, id],
        };

        const result: QueryResult = await dbpool.query(query);
        return result.rowCount != 0;
    }
}
