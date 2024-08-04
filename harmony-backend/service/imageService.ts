import {createClient} from "@supabase/supabase-js";
import {logger} from "../server";

const supabase = createClient(
    "http://host.docker.internal:54321",
    process.env.AUTH_KEY || ""
);
const PROFILE_IMAGES_BUCKET = "profile_images";
const ORG_IMAGES_BUCKET = "orgs_images";

const base64ImageToBlob = (str: string) => {
    // extract content type and base64 payload from original string
    const pos = str.indexOf(';base64,');
    const type = str.substring(5, pos);
    const b64 = str.substr(pos + 8);

    // decode base64
    const imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for(let n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    return new Blob([buffer], {type: type});
}

export class ImageService {
    public static async getAllProfileImages() {
        const { data, error } = await supabase.storage
            .from(PROFILE_IMAGES_BUCKET)
            .list();

        if (error) {
            throw new Error("Error getting profile images: " + error.message);
        }
        return data;
    }

    public static async uploadOrgImage(orgId: number, image: string) {
        logger.info("Change image for organization with id: " + orgId)
        return this.uploadImage(`${orgId}/profile.png`, image, `Error uploading image for org with id: ${orgId}`);
    }

    public static async uploadAlbumImage(albumId: number, orgId: number, image: string) {
        logger.info("Change image for album with id: " + albumId)
        return this.uploadImage(`${orgId}/${albumId}.png`, image, `Error uploading image for album with id: ${albumId}`);
    }

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

    public static async deleteAlbumImage(albumId: number, orgId: number) {
        return this.deleteImage(`${orgId}/${albumId}.png`, `Error deleting image for album with id: ${albumId}`);
    }

    private static async deleteImage(path: string, errorMsg: string) {
        const { data, error } = await supabase.storage
            .from(ORG_IMAGES_BUCKET)
            .remove([path]);

        if (error) {
            throw new Error(errorMsg);
        }
    }
}
