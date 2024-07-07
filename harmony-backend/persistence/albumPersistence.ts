import {QueryResult} from "pg";
import {dbpool} from "./dbConfig";
import {CreateAlbumRequest} from "../models/createAlbumRequest";

export class AlbumPersistence {

    public static async createAlbum(request: CreateAlbumRequest): Promise<any> {
        const query = {
            text: 'INSERT INTO albums (name, org) VALUES ($1, $2) RETURNING (id)',
            values: [request.name, request.org],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async updateAlbum(updatedAlbum: any): Promise<any> {
        const query = {
            text: 'UPDATE albums SET name = $1 WHERE id = $2 RETURNING (id)',
            values: [updatedAlbum.name, updatedAlbum.id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    static async getAlbumById(id: number) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Album not found")
        })();
    }

    static async getAlbumsByOrg(id: number) {
        const query = {
            text: 'SELECT * FROM albums WHERE org = $1',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Albums not found")
        })();
    }

    static async deleteAlbumById(id: number) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING (id)',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Album not found")
        })();
    }
}