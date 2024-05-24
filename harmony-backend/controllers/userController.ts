import { FastifyInstance, FastifyRequest } from "fastify";
import server, { logger } from "../server";
import { AuthService, UserAuth } from "../service/authService";
import { UserService } from "../service/userService";
import { parseCreateUserRequest } from "../models/createUserRequest";
import { parseChangeIconRequest } from "../models/changeIconRequest";
import { handleError, parseId } from "../utils";
import { MemberService } from "../service/memberService";
import { SongService } from "../service/songService";
import { FetchSongsByUserResponse } from "../models/dto/fetchSongsByUserResponse";
import { z } from "zod";
import {AuthenticationError} from "../models/errors/AuthenticationError";
import {AuthorizationError} from "../models/errors/AuthorizationError";

const BASE_URL = "/api/users";

export default async function userController(
    fastify: FastifyInstance,
    opts: any
) {
    server.get(
        BASE_URL + "/:id",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                parseId(id);
                logger.info("Getting user with id: " + id);
                const user = await UserService.getUserById(id);

                return {
                    ...user,
                    image:
                        "http://localhost:54321/storage/v1/object/public/profile_images/" +
                        user.image,
                };
            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/orgs",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot get orgs for another user");
                }

                logger.info("Getting orgs from user with id: " + id);
                return await MemberService.getOrgsByUser(id);
            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );

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
                return "http://localhost:54321/storage/v1/object/public/profile_images/" +
                    request.image
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id" + "/songs",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                if (user.person.id !== id) {
                    throw new AuthorizationError("Cannot get songs for another user");
                }

                logger.info("Getting songs with id: " + id);
                const songs = await SongService.getSongsByUser(id);
                return z.array(FetchSongsByUserResponse).parse(songs);
            } catch (error: any) {
                logger.error(error);
                return handleError(error, rep);
            }
        }
    );
}
