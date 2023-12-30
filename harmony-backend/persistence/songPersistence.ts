import {dbpool} from './dbConfig';
import {CreateSongRequest} from "../models/createSongRequest";
import {QueryResult} from "pg";

export class SongPersistence {

    public static async createSong(request: CreateSongRequest): Promise<any> {
        const query = {
            text: 'INSERT INTO songs (name, author, createdAt, lastModifiedAt) VALUES ($1, $2, NOW(), NOW()) RETURNING (id)',
            values: [request.name, request.author],
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
        return song ? song : (() => {
            throw new Error("Song not found")
        })();
    }
}
