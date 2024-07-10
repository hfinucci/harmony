const BASE_URL = "http://127.0.0.1:3000";

export class ImageService {

    public static async getProfileImages() {
        return await fetch(BASE_URL + "/api/images", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getOrgImage(url: string) {
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    }
}