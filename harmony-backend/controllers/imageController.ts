import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import { ImageService } from "../service/imageService";
import { handleError } from "../utils";

const BASE_URL = "/api/images";

export default async function imageController(
    fastify: FastifyInstance,
    opts: any
) {
    server.get(BASE_URL, async (req, rep) => {
        try {
            logger.info("Getting all profile images");
            return (await ImageService.getAllProfileImages()).map(
                (image) =>
                    "http://localhost:54321/storage/v1/object/public/profile_images/" +
                    image.name
            );
        } catch (error: any) {
            logger.error(error);
            return handleError(error, rep);
        }
    });
}
