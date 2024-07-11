import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {handleError, parseId} from '../utils';
import {AuthService} from "../service/authService";
import {checkIfRequesterIsMember} from "../models/checks";
import {parseCreateAlbumRequest} from "../models/createAlbumRequest";
import {AlbumService} from "../service/albumService";
import {parseUpdateAlbumRequest} from "../models/updateAlbumRequest";
import {SongService} from "../service/songService";

const BASE_URL = '/api/albums'

export default async function albumController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            const request = parseCreateAlbumRequest(req.body);

            await checkIfRequesterIsMember(user.person.id, request.org);
            logger.info("Creating album " + request.name + " in organization with id " + request.org)
            return await AlbumService.createAlbum(request)
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.put(BASE_URL + "/:id", async (req: any, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            const user = AuthService.parseJWT(req.headers.authorization);
            const request = parseUpdateAlbumRequest(req.body);

            const album = await AlbumService.getAlbumById(id)
            await checkIfRequesterIsMember(user.person.id, album.org);

            logger.info("Updating album with id: " + id);
            return await AlbumService.updateAlbum(id, request);
        } catch (err) {
            logger.error(err);
            return handleError(err, rep);
        }
    });

    server.get(
        BASE_URL + "/:id",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                logger.info("Fetching album with id: " + id);
                const album = await AlbumService.getAlbumById(id);

                await checkIfRequesterIsMember(user.person.id, album.org);

                return album;
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/songs",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                await checkIfRequesterIsMember(user.person.id, id);

                logger.info("Fetching songs from album with id: " + id);
                return await SongService.getSongsByAlbum(id);
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.delete(
        BASE_URL + "/:id",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                // Verifica si el usuario es miembro
                const album = await AlbumService.getAlbumById(id)
                await checkIfRequesterIsMember(user.person.id, album.org);

                logger.info("Deleting album with id: " + id);
                // TODO: Delete album image
                return await AlbumService.deleteAlbumById(id);
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.delete(
        BASE_URL + "/:id/cascade",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                // Verifica si el usuario es miembro
                const album = await AlbumService.getAlbumById(id)
                await checkIfRequesterIsMember(user.person.id, album.org);

                // Elimina el álbum y sus canciones en cascada
                await AlbumService.deleteAlbumCascadeById(id);

                logger.info("Deleted album with id: " + id + " and its songs");
                return {"id": id};
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

}