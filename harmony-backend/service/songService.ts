import {CreateSongRequest} from "../models/createSongRequest";
import {SongPersistence} from '../persistence/songPersistence';
import {UpdateSongRequest} from "../models/updateSongRequest";

export class SongService {

    public static async createSong(request: CreateSongRequest) {
        return await SongPersistence.createSong(request);
    }

    public static async updateSong(id: number, request: UpdateSongRequest) {
        const storedSong = await this.getSongById(id)
        const updatedSong = {...storedSong, ...request}
        return await SongPersistence.updateSong(updatedSong);
    }

    public static async getSongById(id: number) {
        return await SongPersistence.getSongById(id);
    }

    public static async getSongsByOrg(id: number) {
        return await SongPersistence.getSongsByOrg(id);
    }

    public static async getSongsByUser(id: number) {
        return await SongPersistence.getSongsByUser(id);
    }

    static async deleteSongById(id: number) {
        return await SongPersistence.deleteSongById(id);
    }
}