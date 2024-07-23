import {dbpool} from './dbConfig';
import {CreateSongRequest} from "../models/createSongRequest";
import {QueryResult} from "pg";

export class SongPersistence {

    public static async createSong(request: CreateSongRequest): Promise<any> {
        const query = {
            text: 'INSERT INTO songs (name, org, created, lastModified, composeId, album) VALUES ($1, $2, NOW(), NOW(), $3, $4) RETURNING (id)',
            values: [request.name, request.org, request.composeId, request.album],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async updateSong(updatedSong: any): Promise<any> {
        const query = {
            text: 'UPDATE songs SET name = $1, lastModified = NOW(), album = $2 WHERE id = $3 RETURNING (id)',
            values: [updatedSong.name, updatedSong.album, updatedSong.id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    static async getSongById(id: number) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Song not found")
        })();
    }

    static async getSongsByOrg(id: number) {
        const query = {
            text: 'SELECT * FROM songs WHERE org = $1',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Songs not found")
        })();
    }

    static async getSongsByAlbum(id: number) {
        const query = {
            text: 'SELECT * FROM songs WHERE album = $1 ORDER BY lastmodified DESC',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Songs not found")
        })();
    }

    static async deleteSongById(id: number) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING (id)',
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows[0];
        return song ?? (() => {
            throw new Error("Song not found")
        })();
    }

    static async getSongsByUser(id: number) {
        const query = {
            text: `SELECT
                s.id as id,
                o.name as org,
                s.name as name,
                created as created,
                lastmodified as lastmodified
                FROM organizations o
                INNER JOIN members m
                ON o.id = m.org_id
                INNER JOIN songs s on m.org_id = s.org
                WHERE m.user_id = $1;`,
            values: [id],
        };
        const result: QueryResult = await dbpool.query(query);
        const song = result.rows;
        return song ?? (() => {
            throw new Error("Songs not found")
        })();
    }
}
