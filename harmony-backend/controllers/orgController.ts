import { FastifyInstance, FastifyRequest } from "fastify";
import server, { logger } from "../server";
import { OrgService } from "../service/orgService";
import {handleError, parseId} from "../utils";
import { parseUpdateOrgRequest } from "../models/updateOrgRequest";
import { parseCreateOrgRequest } from "../models/createOrgRequest";
import { MemberService } from "../service/memberService";
import { SongService } from "../service/songService";
import { AuthService } from "../service/authService";
import { ImageService } from "../service/imageService";
import {AuthorizationError} from "../models/errors/AuthorizationError";
import {checkIfRequesterIsMember} from "../models/checks";
import {AlbumService} from "../service/albumService";

const BASE_URL = "/api/orgs";

export default async function orgController(
    fastify: FastifyInstance,
    opts: any
) {
    server.post(BASE_URL, async (req, rep) => {
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            const request = parseCreateOrgRequest(req.body);
            logger.info("Creating organization: " + request.name);
            const create = await OrgService.createOrg(request);
            if (create != null) {
                logger.info(
                    "Adding user " +
                        user.person.name +
                        " to organization: " +
                        request.name
                );
                await MemberService.createMember(user.person.id, create.id);
            }
            return create;
        } catch (err) {
            logger.error(err);
            return handleError(err, rep);
        }
    });

    server.put(BASE_URL + "/:id", async (req: any, rep) => {
        const id = req.params.id;
        try {
            const user = AuthService.parseJWT(req.headers.authorization);
            parseId(id);

            const request = parseUpdateOrgRequest(req.body);

            await checkIfRequesterIsMember(user.person.id, id);

            logger.info("Updating org with id: " + id);
            return await OrgService.updateOrg(id, request);
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

                logger.info("Fetching org with id: " + id);
                const org = await OrgService.getOrgById(id);

                await checkIfRequesterIsMember(user.person.id, id)

                return {
                    ...org,
                    image:
                        process.env.IMAGE_PATH + "orgs_images/orgs/" +
                        id +
                        ".png",
                };
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/members",
        async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
            const id = req.params.id;
            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                logger.info("Fetching members from org with id: " + id);
                const members = await MemberService.getMembersByOrg(id);

                logger.info("Checking if user is member of org with id: " + id);
                if (!members.some((member) => member.id === user.person.id)) {
                    throw new AuthorizationError("User is not a member of this organization");
                }
                return members.map((member) => ({
                    ...member,
                    image:
                        process.env.IMAGE_PATH  + "profile_images/" +
                        member.image,
                }));
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/songs",
        async (req: FastifyRequest<{ Params: { id: number }; Querystring: { page: string, limit: string } }>, rep) => {
            const id = req.params.id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || null;

            logger.info("Limit for org songs is: " + req.query.limit)

            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                await checkIfRequesterIsMember(user.person.id, id);

                logger.info("Fetching songs from org with id: " + id);
                const result = await SongService.getSongsByOrg(id, page, limit);

                return rep.send({
                    page,
                    totalItems: result.totalSongs,
                    totalPages: limit? Math.ceil(result.totalSongs / limit) : 1,
                    songs: result.songs,
                });

            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );

    server.get(
        BASE_URL + "/:id/singles",
        async (req: FastifyRequest<{ Params: { id: number }; Querystring: { page: string, limit: string } }>, rep) => {
            const id = req.params.id;
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            try {
                const user = AuthService.parseJWT(req.headers.authorization);
                parseId(id);

                await checkIfRequesterIsMember(user.person.id, id);

                logger.info("Fetching songs from org with id: " + id);
                const result = await SongService.getSinglesByOrg(id, page, limit);
                return rep.send({
                    page,
                    totalItems: result.totalSingles,
                    totalPages: Math.ceil(result.totalSingles / limit),
                    singles: result.singles,
                });
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
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

                await checkIfRequesterIsMember(user.person.id, id);

                logger.info("Fetching albums from org with id: " + id);
                const result = await AlbumService.getAlbumsByOrg(id, page, limit);

                return rep.send({
                    page,
                    totalItems: result.totalAlbums,
                    totalPages: Math.ceil(result.totalAlbums / limit),
                    albums: result.albums.map((a) => ({
                        ...a,
                        image: process.env.IMAGE_PATH + "orgs_images/albums/" + a.id + ".png"
                    })),
                });
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

                await checkIfRequesterIsMember(user.person.id, id);

                logger.info("Deleting org with id: " + id);
                await ImageService.deleteOrgImage(id);
                return await OrgService.deleteOrgById(id);
            } catch (err) {
                logger.error(err);
                return handleError(err, rep);
            }
        }
    );
}
