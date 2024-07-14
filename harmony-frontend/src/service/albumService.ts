const BASE_URL = "http://127.0.0.1:3000";

export class AlbumService {

    static async createAlbum(name: string, org: number) {
        return await fetch(BASE_URL + "/api/albums", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
            body: JSON.stringify({
                name: name,
                org: +org
            }),
        })
    }

    static async getAlbumById(id: number) {
        return await fetch(BASE_URL + "/api/albums/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
        })
    }
}
