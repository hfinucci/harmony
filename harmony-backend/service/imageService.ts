import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "http://localhost:54321",
    process.env.AUTH_KEY || ""
);
const PROFILE_IMAGES_BUCKET = "profile_images";
const ORG_IMAGES_BUCKET = "orgs_images";

const base64ImageToBlob = (str: string) => {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);

    // decode base64
    var imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for(var n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });

    return blob;
}

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

    public static async uploadOrgImage(orgId: number, image: string) {
        return this.uploadImage(`${orgId}/profile.png`, image, `Error uploading image for org with id: ${orgId}`);
    }

    // Dejo esto para reutilizarlo en albums
    private static async uploadImage(path: string, image: string, errorMsg: string) {
        const { data, error } = await supabase.storage
            .from(ORG_IMAGES_BUCKET)
            .upload(path, base64ImageToBlob(image), {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            throw new Error(errorMsg);
        }
        return data;
    }

    public static async deleteOrgImage(orgId: number) {
        return this.deleteImage(`${orgId}/profile.png`, `Error deleting image for org with id: ${orgId}`);
    }

    // Dejo esto para reutilizarlo en albums
    private static async deleteImage(path: string, errorMsg: string) {
        const { data, error } = await supabase.storage
            .from(ORG_IMAGES_BUCKET)
            .remove([path]);

        if (error) {
            throw new Error(errorMsg);
        }
    }
}
