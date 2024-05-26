import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import { ImageService } from "../service/imageService";
import { handleError } from "../utils";
import 'dotenv/config'

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
                    process.env.IMAGE_PATH + "profile_images/" +
                    image.name
            );
        } catch (error: any) {
            logger.error(error);
            return handleError(error, rep);
        }
    });
}
