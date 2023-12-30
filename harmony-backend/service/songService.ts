import {CreateSongRequest} from "../models/createSongRequest";
import {SongPersistence} from '../persistence/songPersistence';

export class SongService {

    public static async createSong(request: CreateSongRequest) {
        return await SongPersistence.createSong(request);
    }
}