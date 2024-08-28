import {CreateAlbumRequest} from "../models/createAlbumRequest";
import {AlbumPersistence} from "../persistence/albumPersistence";
import {UpdateAlbumRequest} from "../models/updateAlbumRequest";
import {ImageService} from "./imageService";

export class AlbumService {

    public static async createAlbum(request: CreateAlbumRequest) {
        const album = await AlbumPersistence.createAlbum(request);
        if (request.image != null)
            await ImageService.uploadAlbumImage(album.id, request.org, request.image);
        if (!album)
            throw new Error("Error creating album")
        return album;
    }

    public static async updateAlbum(id: number, request: UpdateAlbumRequest) {
        const storedAlbum = await this.getAlbumById(id)
        const updatedAlbum = {...storedAlbum, ...request}
        if (request.image != null) {
            await ImageService.uploadAlbumImage(updatedAlbum.id, updatedAlbum.org, request.image);
        }
        return await AlbumPersistence.updateAlbum(updatedAlbum);
    }

    public static async getAlbumById(id: number) {
        return await AlbumPersistence.getAlbumById(id);
    }

    public static async getAlbumsByOrg(id: number, page: number, limit:number) {
        return await AlbumPersistence.getAlbumsByOrg(id, page, limit);
    }

    public static async getAlbumsByUser(id: number, page: number, limit: number) {
        return await AlbumPersistence.getAlbumsByUser(id, page, limit);
    }

    static async deleteAlbumById(id: number) {
        return await AlbumPersistence.deleteAlbumById(id);
    }

    static async deleteAlbumCascadeById(id: number) {
        return await AlbumPersistence.deleteAlbumCascadeById(id);
    }
}
