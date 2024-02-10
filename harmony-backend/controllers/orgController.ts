import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {OrgService} from '../service/orgService';
import {handleError, parseId} from "../utils";
import {parseUpdateOrgRequest} from "../models/updateOrgRequest";
import {parseCreateOrgRequest} from "../models/createOrgRequest";
import {MemberService} from "../service/memberService";
import {SongService} from "../service/songService";
import {AuthService} from "../service/authService";

const BASE_URL = '/api/orgs'

export default async function orgController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const user = AuthService.parseJWT(req.headers.authorization)
            const request = parseCreateOrgRequest(req.body);
            logger.info("Creating organization: " + request.name);
            const create = await OrgService.createOrg(request);
            if (create != null) {
                logger.info("Adding user " + user.person?.name + " to organization: " + request.name);
                await MemberService.createMember(user.person?.id || 0, create.id)
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
            return await MemberService.getMembersByOrg(id);
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
