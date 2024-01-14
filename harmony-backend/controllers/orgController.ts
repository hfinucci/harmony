import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {OrgService} from '../service/orgService';
import {handleError, parseId, parseJWT} from "../utils";
import {parseUpdateOrgRequest} from "../models/updateOrgRequest";
import {parseCreateOrgRequest} from "../models/createOrgRequest";
import {MemberService} from "../service/memberService";
import {SongService} from "../service/songService";
import {UserService} from "../service/userService";

const BASE_URL = '/api/org'

export default async function orgController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateOrgRequest(req.body);
            logger.info("Creating organization: " + request.name);
            const create = await OrgService.createOrg(request);
            if (create != null) {
                const user = parseJWT(req.headers.authorization || "")
                if (user.payload != null) {
                    logger.info("Adding user " + user.payload.name + " to organization: " + request.name);
                    await MemberService.createMember(user.payload.id, create.id)
                }
            }
            return create;
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.put(BASE_URL + '/:id', async (req: any, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            const request = parseUpdateOrgRequest(req.body);
            logger.info("Updating org with id: " + id);
            return await OrgService.updateOrg(id, request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Fetching org with id: " + id);
            return await OrgService.getOrgById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.get(BASE_URL + '/:id/members', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Fetching members from org with id: " + id);
            const members = await MemberService.getMembersByOrg(id);
            return await Promise.all(
                members.map(async (m) => {
                    const user = await UserService.getUserById(m.user_id);
                    return user.name
                }))
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.get(BASE_URL + '/:id/songs', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Fetching songs from org with id: " + id);
            return await SongService.getSongsByOrg(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.delete(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Deleting org with id: " + id);
            return await OrgService.deleteOrgById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
