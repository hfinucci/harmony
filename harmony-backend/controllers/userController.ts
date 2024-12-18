import { FastifyInstance, FastifyRequest } from "fastify";
import server, { logger } from "../server";
import { AuthService, UserAuth } from "../service/authService";
import { UserService } from "../service/userService";
import { parseCreateUserRequest } from "../models/createUserRequest";
import { parseChangeIconRequest } from "../models/changeIconRequest";
import {handleError, parseId} from "../utils";
import { MemberService } from "../service/memberService";
import { SongService } from "../service/songService";
import { FetchSongsByUserResponse } from "../models/dto/fetchSongsByUserResponse";
import { z } from "zod";
import {AuthorizationError} from "../models/errors/AuthorizationError";
import {AlbumService} from "../service/albumService";

const BASE_URL = "/api/users";

export default async function userController(
    fastify: FastifyInstance,
    opts: any
) {
    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateUserRequest(req.body);
            logger.info("Signing up user with email: " + request.email);
            await UserService.createUser(request);
            return await AuthService.login(request);
        } catch (error: any) {
            logger.error(error);
            return handleError(error, rep);
        }
    });

    server.put(
        BASE_URL + "/:id",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                const id = req.params.id;
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot update profile image for another user");
                }

                const request = parseChangeIconRequest(req.body);
                logger.info("Changing image for user with id " + id + " to " + request.image);
                const changed = await UserService.changeIcon(id, request);
                if (!changed)
                    return false
                return request.image
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/songs",
        async (req: FastifyRequest<{ Params: { id: number }; Querystring: { page: string, limit: string }  }>, rep) => {
            const id = req.params.id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;


            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot get songs for another user");
                }

                logger.info("Getting songs from user with id: " + id);
                const result = await SongService.getSongsByUser(id, page, limit);

                return rep.send({
                    page,
                    totalItems: result.totalSongs,
                    totalPages: Math.ceil(result.totalSongs / limit),
                    songs: z.array(FetchSongsByUserResponse).parse(result.songs),
                });

            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/albums",
        async (req: FastifyRequest<{ Params: { id: number }; Querystring: { page: string, limit: string } }>, rep) => {
            const id = req.params.id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot get albums for another user");
                }

                logger.info("Getting albums from user with id: " + id);

                const result = await AlbumService.getAlbumsByUser(id, page, limit);

                return rep.send({
                    page,
                    totalItems: result.totalAlbums,
                    totalPages: Math.ceil(result.totalAlbums / limit),
                    albums: result.albums,
                });

            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                parseId(id);
                logger.info("Getting user with id: " + id);
                return await UserService.getUserById(id);
            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/orgs",
        async (req: FastifyRequest<{ Params: { id: number }; Querystring: { page: string, limit: string } }>, rep) => {
            const id = req.params.id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;


            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot get orgs for another user");
                }

                logger.info("Getting orgs from user with id: " + id);
                const result = await MemberService.getOrgsByUser(id, page, limit);

                return rep.send({
                    page,
                    totalItems: result.totalOrgs,
                    totalPages: Math.ceil(result.totalOrgs / limit),
                    orgs: result.orgs,
                });
            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

    // TODO FIX DELETE USER
    server.delete(
        BASE_URL,
        async (req, rep) => {
            try {
                const userAuth: UserAuth = AuthService.parseJWT(
                    req.headers.authorization
                );
                return await UserService.deleteUserById(userAuth.person.id);
            } catch (err) {
                logger.info(err);
                return handleError(err, rep);
            }
        }
    );

}
