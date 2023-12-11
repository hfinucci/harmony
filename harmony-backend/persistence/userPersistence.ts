import { QueryResult } from 'pg';
import { dbpool } from './dbConfig';
import { logger } from '../server';

export class UserPersistence {

    public static async getUserName(userId: number): Promise<string | null> {
        const query = {
            text: 'SELECT name FROM users WHERE id = $1',
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0]?.name ?? null;
    }

    public static async getUserWithAuthId(auth_id: string): Promise<object | null> {
        const query = {
            text: 'SELECT * FROM users WHERE auth_id = $1',
            values: [auth_id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async getAuthId(userId: number): Promise<string | null> {
        const query = {
            text: 'SELECT auth_id FROM users WHERE id = $1',
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0]?.auth_id ?? null;
    }

    public static async createUser(email: string, name: string, auth_id: string) : Promise<boolean | null> {
        const query = {
            text: 'INSERT INTO users (email, name, auth_id, image) VALUES ($1, $2, $3, $4)',
            values: [email, name, auth_id, "http://localhost:54321/storage/v1/object/public/profile-images/cow.png?t=2023-12-11T20%3A56%3A30.874Z"]
        };

        const result: QueryResult = await dbpool.query(query);
        return result != null;
    }

    public static async deleteUser(id: number) : Promise<boolean | null> {
        const query = {
            text: 'DELETE FROM users WHERE id = $1;',
            values: [id]
        };

        const result: QueryResult = await dbpool.query(query);
        return result != null;
    }

    public static async changeImg(id: number, url: string) : Promise<boolean | null> {
        const query = {
            text: 'UPDATE users SET image = $1 WHERE id = $2',
            values: [url, id]
        };

        const result: QueryResult = await dbpool.query(query);
        return result != null;
    }
}
