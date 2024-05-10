import {dbpool} from './dbConfig';
import {CreateMemberRequest} from "../models/createMemberRequest";
import {QueryResult} from "pg";

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
            text: 'SELECT name, id, image FROM members JOIN users ON members.user_id = users.id WHERE members.org_id = $1',
            values: [org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Members not found")
        })();
    }

    static async getOrgsByUser(user: number) {
        const query = {
            text: 'SELECT id, name FROM members JOIN organizations ON members.org_id = organizations.id WHERE members.user_id = $1',
            values: [user],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Orgs not found")
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