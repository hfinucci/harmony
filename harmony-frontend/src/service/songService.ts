const BASE_URL = "http://127.0.0.1:3000";

export class SongService {
    public static async createSong(name: string, org: number) {
        return await fetch(BASE_URL + "/api/songs", {
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

    public static async getSongById(id: number) {
        return await fetch(BASE_URL + "/api/songs/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }
}