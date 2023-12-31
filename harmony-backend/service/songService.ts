import {CreateSongRequest} from "../models/createSongRequest";
import {SongPersistence} from '../persistence/songPersistence';

export class SongService {

    public static async createSong(request: CreateSongRequest) {
        return await SongPersistence.createSong(request);
    }

    public static async getSongById(id: number) {
        return await SongPersistence.getSongById(id);
    }

    static async deleteSongById(id: number) {
        return await SongPersistence.deleteSongById(id);
    }
}