const BASE_URL = "http://127.0.0.1:3000";

export class BlockService {

    public static async getSongBlocksById(id: string) {
        return await fetch(BASE_URL + "/api/compose/" + id + "/blocks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }
}