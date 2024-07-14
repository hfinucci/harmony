import {CreateAlbumRequest} from "../models/createAlbumRequest";
import {AlbumPersistence} from "../persistence/albumPersistence";
import {UpdateAlbumRequest} from "../models/updateAlbumRequest";

export class AlbumService {

    public static async createAlbum(request: CreateAlbumRequest) {
        const album = await AlbumPersistence.createAlbum(request);
        //TODO: Handle image
        if (!album)
            throw new Error("Error creating album")
        return album;
    }

    public static async updateAlbum(id: number, request: UpdateAlbumRequest) {
        const storedAlbum = await this.getAlbumById(id)
        const updatedAlbum = {...storedAlbum, ...request}
        return await AlbumPersistence.updateAlbum(updatedAlbum);
    }

    public static async getAlbumById(id: number) {
        return await AlbumPersistence.getAlbumById(id);
    }

    public static async getAlbumsByOrg(id: number) {
        return await AlbumPersistence.getAlbumsByOrg(id);
    }

    public static async getAlbumsByUser(id: number) {
        return await AlbumPersistence.getAlbumsByUser(id);
    }

    static async deleteAlbumById(id: number) {
        return await AlbumPersistence.deleteAlbumById(id);
    }

    static async deleteAlbumCascadeById(id: number) {
        return await AlbumPersistence.deleteAlbumCascadeById(id);
    }
}
