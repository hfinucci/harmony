import {CreateSongRequest} from "../models/createSongRequest";
import {SongPersistence} from '../persistence/songPersistence';
import {logger} from "../server";

export class SongService {

    public static async createSong(request: CreateSongRequest) {
        return await SongPersistence.createSong(request);
    }

    public static async getSongById(id: number) {
        return await SongPersistence.getSongById(id);
    }
}