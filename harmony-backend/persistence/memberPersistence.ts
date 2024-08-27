import {dbpool} from './dbConfig';
import {QueryResult} from "pg";
import {AuthorizationError} from "../models/errors/AuthorizationError";

export class MemberPersistence {

    public static async createMembership(user: number, org: number): Promise<any> {
        const query = {
            text: 'INSERT INTO members (user_id, org_id) VALUES ($1, $2) RETURNING (user_id, org_id)',
            values: [user, org],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    static async getMembersByOrg(org: number) {
        const query = {
            text: 'SELECT name, id, image, email FROM members JOIN users ON members.user_id = users.id WHERE members.org_id = $1',
            values: [org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Members not found")
        })();
    }

    static async getOrgsByUser(user: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM members
                         JOIN organizations ON members.org_id = organizations.id
                WHERE members.user_id = $1
            `,
            values: [user]
        };

        const query = {
            text: `
            SELECT id, name 
            FROM members 
            JOIN organizations ON members.org_id = organizations.id 
            WHERE members.user_id = $1
            ORDER BY organizations.id desc 
            LIMIT $2 OFFSET $3
        `,
            values: [user, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalOrgs = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const orgs = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalOrgs,
                orgs
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching orgs:', error);
            throw new Error("Orgs not found")
        }
    }

    static async getMembership(user: number, org: number) {
        const query = {
            text: 'SELECT * FROM members WHERE user_id = $1 and org_id = $2',
            values: [user, org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new AuthorizationError("Membership not found")
        })();
    }

    static async deleteMembership(user: number, org: number) {
        const query = {
            text: 'DELETE FROM members WHERE user_id = $1 and org_id = $2 RETURNING (user_id, org_id)',
            values: [user, org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Membership not found")
        })();
    }
}