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
}
