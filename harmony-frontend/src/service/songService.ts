import {BASE_URL} from "../App.tsx";

export class SongService {

    public static async getSongsByUser(id: number) {
        return await fetch(BASE_URL + "/api/user/" + id + "/songs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}