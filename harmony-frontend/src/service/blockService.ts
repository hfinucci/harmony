import {BASE_URI} from "../utils.ts";

export class BlockService {

    public static async getSongBlocksById(id: string) {
        return await fetch(BASE_URI + "/api/compose/" + id + "/blocks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
    }
}