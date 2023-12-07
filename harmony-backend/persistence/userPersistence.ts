import { QueryResult } from 'pg';
import { dbpool } from './dbConfig';

export class UserPersistence {

    public static async getUserName(userId: number): Promise<string | null> {
        const query = {
            text: 'SELECT name FROM users WHERE id = $1',
            values: [userId],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0]?.name ?? null;
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
            text: 'INSERT INTO users (email, name, auth_id) VALUES ($1, $2, $3)',
            values: [email, name, auth_id]
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
}
