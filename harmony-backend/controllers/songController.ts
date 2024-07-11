import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {SongService} from '../service/songService';
import {parseCreateSongRequest} from "../models/createSongRequest";
import {handleError, parseId} from "../utils";
import {parseUpdateSongRequest} from "../models/updateSongRequest";
import {AuthService} from "../service/authService";
import {checkIfAlbumIsFromOrg, checkIfRequesterIsMember} from "../models/checks";

const BASE_URL = '/api/songs'

export default async function songController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            const request = parseCreateSongRequest(req.body);

            await checkIfRequesterIsMember(user.person.id, request.org);

            logger.info("Creating song: " + request.name);
            return await SongService.createSong(request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.put(BASE_URL + '/:id', async (req: any, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            const user = AuthService.parseJWT(req.headers.authorization);
            const request = parseUpdateSongRequest(req.body);

            const song = await SongService.getSongById(id)
            await checkIfRequesterIsMember(user.person.id, song.org);

            if(request.album)
                await checkIfAlbumIsFromOrg(request.album, song.org);

            logger.info("Updating song with id: " + id);
            return await SongService.updateSong(song, request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            parseId(id);

            logger.info("Fetching song with id: " + id);
            const song = await SongService.getSongById(id);

            await checkIfRequesterIsMember(user.person.id, song.org);

            return song;
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.delete(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            parseId(id);

            const song = await SongService.getSongById(id);
            await checkIfRequesterIsMember(user.person.id, song.org);

            logger.info("Deleting song with id: " + id);
            return await SongService.deleteSongById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
