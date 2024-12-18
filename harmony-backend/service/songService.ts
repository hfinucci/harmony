import {CreateSongRequest} from "../models/createSongRequest";
import {SongPersistence} from '../persistence/songPersistence';
import {UpdateSongRequest} from "../models/updateSongRequest";
import {Block, ComposePersistence} from "../persistence/composePersistence";
import {Person, UserAuth} from "./authService";

export class SongService {

    public static async createSong(request: CreateSongRequest) {
        const composeId = await ComposePersistence.createSong();
        if (composeId) {
            request.composeId = composeId;
        }
        return await SongPersistence.createSong(request);
    }

    public static async updateSong(song: any, request: UpdateSongRequest) {
        const updatedSong = {...song, ...request}
        return await SongPersistence.updateSong(updatedSong);
    }

    public static async searchSongs(input: string, user: UserAuth) {
        return await SongPersistence.searchSongs(input, user);
    }

    public static async getSongById(id: number) {
        return await SongPersistence.getSongById(id);
    }

    public static async getSongsByOrg(id: number, page: number, limit: number | null) {
        return await SongPersistence.getSongsByOrg(id, page, limit);
    }

    public static async getSinglesByOrg(id: number, page: number, limit: number) {
        return await SongPersistence.getSinglesByOrg(id, page, limit);
    }

    public static async getSongsByAlbum(id: number, page: number, limit: number | null) {
        return await SongPersistence.getSongsByAlbum(id, page, limit);
    }

    public static async getSongsByUser(id: number, page: number, limit: number) {
        return await SongPersistence.getSongsByUser(id, page, limit);
    }

    static async deleteSongById(id: number) {
        return await SongPersistence.deleteSongById(id);
    }

    static async getSongBlocksById(id: string): Promise<Block[][]> {
        return await ComposePersistence.getSongBlocksById(id)
    }
}