const BASE_URL = "http://127.0.0.1:3000";

export class ImageService {

    public static async getProfileImages() {
        return await fetch(BASE_URL + "/api/images", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

}