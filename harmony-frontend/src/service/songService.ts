const BASE_URL = "http://127.0.0.1:3000";

export class SongService {
    public static async createSong(name: string, org: number, album: number) {
        let body: { org: number; album?: number; name: string } = {
            name: name,
            org: +org,
        };

        if (album != 0) {
            body = {
                ...body, // Propaga las propiedades existentes de 'body'
                album: +album // Agrega la propiedad 'album' solo si 'album' es diferente de 0
            };
        }
        return await fetch(BASE_URL + "/api/songs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
            body: JSON.stringify(body),
        })
    }

    public static async getSongById(id: number) {
        return await fetch(BASE_URL + "/api/songs/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
        })
    }

    public static async deleteSongs(id: number) {
        return await fetch(BASE_URL + "/api/songs/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
        })
    }
}