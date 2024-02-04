import {dbpool} from './dbConfig';
import {CreateOrgRequest} from "../models/createOrgRequest";
import {QueryResult} from "pg";

export class OrgPersistence {

    public static async createOrg(request: CreateOrgRequest): Promise<any> {
        const query = {
            text: 'INSERT INTO organizations (name) VALUES ($1) RETURNING (id)',
            values: [request.name],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async updateOrg(updatedOrg: any): Promise<any> {
        const query = {
            text: 'UPDATE organizations SET name = $1, image = $2 WHERE id = $3 RETURNING *',
            values: [updatedOrg.name, updatedOrg.image, updatedOrg.id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    static async getOrgById(id: number) {
        const query = {
            text: 'SELECT * FROM organizations WHERE id = $1',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Org not found")
        })();
    }

    static async deleteOrgById(id: number) {
        const query = {
            text: 'DELETE FROM organizations WHERE id = $1 RETURNING (id)',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Org not found")
        })();
    }
}