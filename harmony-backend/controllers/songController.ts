import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import server, {logger} from "../server";
import {SongService} from '../service/songService';
import {parseCreateSongRequest} from "../models/createSongRequest";
import {z} from "zod";

const BASE_URL = '/api/song'

export default async function songController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateSongRequest(req.body);
            logger.info("Creating song: " + request.name);
            return await SongService.createSong(request);
        } catch (err) {
            logger.error(err)
            if (err instanceof z.ZodError) {
                return rep
                    .code(400)
                    .send()
            } else {
                return rep
                    .code(404)
                    .send()
            }
        }
    });

}