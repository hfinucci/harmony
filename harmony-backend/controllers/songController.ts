import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {SongService} from '../service/songService';
import {parseCreateSongRequest} from "../models/createSongRequest";
import {z} from "zod";
import {handleError, parseId} from "../utils";

const BASE_URL = '/api/song'

export default async function songController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateSongRequest(req.body);
            logger.info("Creating song: " + request.name);
            return await SongService.createSong(request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Fetching song with id: " + id);
            return await SongService.getSongById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.delete(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Deleting song with id: " + id);
            return await SongService.deleteSongById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
