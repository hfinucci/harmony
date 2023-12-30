import {QueryResult} from 'pg';
import {dbpool} from './dbConfig';
import {CreateSongRequest} from "../models/createSongRequest";

export class SongPersistence {

    public static async createSong(request: CreateSongRequest): Promise<any> {
        const query = {
            text: 'INSERT INTO songs (name, author, createdAt, lastModifiedAt) VALUES ($1, $2, NOW(), NOW())',
            values: [request.name, request.author],
        };
        await dbpool.query(query);
        return
    }
}
