import {BASE_URI} from "../utils.ts";

export class SearchService {

    public static async searchEntities(input: string) {
        return await fetch(BASE_URI + "/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
            body: JSON.stringify({
                query: input,
            }),
        })
    }
}
