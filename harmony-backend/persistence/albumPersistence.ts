import {QueryResult} from "pg";
import {dbpool} from "./dbConfig";
import {CreateAlbumRequest} from "../models/createAlbumRequest";
import {UserAuth} from "../service/authService";

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
            text: 'UPDATE albums SET name = $1, last_modified = NOW() WHERE id = $2 RETURNING *',
            values: [updatedAlbum.name, updatedAlbum.id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows[0] ?? null;
    }

    public static async searchAlbums(input: string, user: UserAuth) {
        const query = {
            text: 'SELECT * FROM albums, members WHERE albums.org = members.org_id AND albums.name ILIKE $1 AND members.user_id = $2 LIMIT 3',
            values: [`%${input}%`, user.person.id],
        };
        const result: QueryResult = await dbpool.query(query);
        return result.rows ?? []
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

    static async getAlbumsByOrg(id: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM albums 
                WHERE org = $1
            `,
            values: [id]
        };

        const query = {
            text: 'SELECT * FROM albums WHERE org = $1 ORDER BY last_modified DESC LIMIT $2 OFFSET $3',
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalAlbums = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const albums = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalAlbums,
                albums
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching albums:', error);
            throw new Error("Albums not found")
        }
    }

    static async getAlbumsByUser(id: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const countQuery = {
            text: `
                SELECT COUNT(*)
                FROM albums a JOIN members m ON a.org=m.org_id 
                WHERE m.user_id = $1
            `,
            values: [id]
        };

        const query = {
            text: 'SELECT a.id as id, m.org_id as org, a.name as name FROM albums a JOIN members m ON a.org=m.org_id WHERE m.user_id = $1 ORDER BY a.last_modified DESC LIMIT $2 OFFSET $3',
            values: [id, limit, offset],
        };

        try {
            await dbpool.query('BEGIN');

            const totalResult: QueryResult = await dbpool.query(countQuery)
            const totalAlbums = parseInt(totalResult.rows[0].count, 10);

            const result: QueryResult = await dbpool.query(query);
            const albums = result.rows;

            await dbpool.query('COMMIT');

            return {
                totalAlbums,
                albums
            };
        } catch (error) {
            await dbpool.query('ROLLBACK'); // Revierte la transacción en caso de error
            console.error('Error fetching albums:', error);
            throw new Error("Albums not found")
        }
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

    static async deleteAlbumCascadeById(id: number): Promise<any> {
        const client = await dbpool.connect();

        try {
            await client.query('BEGIN');

            // Elimina las canciones del álbum
            const deleteSongsQuery = {
                text: 'DELETE FROM songs WHERE album = $1',
                values: [id],
            };
            await client.query(deleteSongsQuery);

            // Elimina el álbum
            const deleteAlbumQuery = {
                text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
                values: [id],
            };
            const result: QueryResult = await client.query(deleteAlbumQuery);

            if (!result.rows[0]) {
                throw new Error("Album not found");
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}