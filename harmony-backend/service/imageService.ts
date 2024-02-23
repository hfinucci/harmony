import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "http://localhost:54321",
    process.env.AUTH_KEY || ""
);
const PROFILE_IMAGES_BUCKET = "profile_images";

export class ImageService {
    public static async getAllProfileImages() {
        const { data, error } = await supabase.storage
            .from(PROFILE_IMAGES_BUCKET)
            .list();

        if (error) {
            throw new Error("Error getting profile images");
        }
        return data;
    }
}
