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
            text: 'UPDATE songs SET name = $1, lastModified = NOW(), album = $2 WHERE id = $3 RETURNING *',
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

    static async getSongsByOrg(id: number, page: number, limit: number | null) {
        let offset = null
        if (limit)
            offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM songs 
                WHERE org = $1
            `,
            values: [id]
        };

        const query = {
            text: 'SELECT * FROM songs WHERE org = $1 LIMIT $2 OFFSET $3',
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalSongs = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const songs = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalSongs,
                songs
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching songs:', error);
            throw new Error("Songs not found");
        }
    }

    static async getSinglesByOrg(id: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM songs 
                WHERE org = $1 and album is null
            `,
            values: [id]
        };

        const query = {
            text: 'SELECT * FROM songs WHERE org = $1 and album is null LIMIT $2 OFFSET $3',
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalSingles = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const singles = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalSingles,
                singles
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching singles:', error);
            throw new Error("Singles not found");
        }
    }

    static async getSongsByAlbum(id: number, page: number, limit: number | null) {
        let offset
        if (limit)
            offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM songs 
                WHERE album = $1
            `,
            values: [id]
        };

        const query = {
            text: 'SELECT * FROM songs WHERE album = $1 ORDER BY lastmodified DESC LIMIT $2 OFFSET $3',
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalSongs = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const songs = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalSongs,
                songs
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching songs:', error);
            throw new Error("Songs not found");
        }
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

    static async getSongsByUser(id: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM organizations o
                         INNER JOIN members m
                                    ON o.id = m.org_id
                         INNER JOIN songs s on m.org_id = s.org
                WHERE m.user_id = $1
            `,
            values: [id]
        };

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
                WHERE m.user_id = $1
                LIMIT $2 OFFSET $3
                `,
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalSongs = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const songs = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalSongs,
                songs
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching songs:', error);
            throw new Error('Error fetching songs');
        }

    }
}
