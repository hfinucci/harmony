import {BASE_URI} from "../utils.ts";

export class ImageService {

    public static async getProfileImages() {
        return await fetch(BASE_URI + "/api/images", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getImage(id: number, type: string) {
        return await fetch(BASE_URI + "/api/images/" + id + "?type=" + type, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    }
}