import {FastifyInstance, FastifyRequest} from "fastify";
import server, { logger } from "../server";
import { ImageService } from "../service/imageService";
import {handleError, parseId, parseType} from "../utils";
import 'dotenv/config'

const BASE_URL = "/api/images";

export default async function imageController(
    fastify: FastifyInstance,
    opts: any
) {
    server.get(BASE_URL, async (req, rep) => {
        try {
            logger.info("Getting all profile images");
            return {
                images: ImageService.getAllProfileImages()
            };
        } catch (error: any) {
            logger.error(error);
            return handleError(error, rep);
        }
    });

    server.get(BASE_URL + "/:id", async (req: FastifyRequest<{ Params: { id: number }, Querystring: { type: string } }>, rep) => {
        const id = req.params.id;
        const type = req.query.type;
        try {
            logger.info("TYPE FROM QUERT: " + type)
            parseId(id)
            parseType(type)
            logger.info("Getting image with id: " + id);
            const image = await ImageService.getImage(id, type);
            return image;
        } catch (error: any) {
            logger.error(error);
            return handleError(error, rep);
        }
    });
}
