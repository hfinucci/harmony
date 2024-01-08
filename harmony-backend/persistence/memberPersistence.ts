import {dbpool} from './dbConfig';
import {CreateMemberRequest} from "../models/createMemberRequest";
import {QueryResult} from "pg";

export class MemberPersistence {

    public static async createMembership(user: number, org: number): Promise<any> {
        const query = {
            text: 'INSERT INTO members (user, org) VALUES ($1) RETURNING (id)',
            values: [user, org],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    static async getMembersByOrg(org: number) {
        const query = {
            text: 'SELECT user FROM members WHERE org = $1',
            values: [org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Members not found")
        })();
    }

    static async getOrgsByUser(user: number) {
        const query = {
            text: 'SELECT org FROM members WHERE user = $1',
            values: [user],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Orgs not found")
        })();
    }

    static async deleteMembership(user: number, org: number) {
        const query = {
            text: 'DELETE FROM member WHERE user = $1 and org = $2 RETURNING (user, org)',
            values: [user, org],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Membership not found")
        })();
    }
}