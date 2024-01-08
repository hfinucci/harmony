import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {MemberService} from '../service/memberService';
import {handleError, parseId} from "../utils";
import {parseCreateMemberRequest} from "../models/createMemberRequest";

const BASE_URL = '/api/member'

export default async function memberController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateMemberRequest(req.body);
            logger.info("Creating membership of user with id " + request.user + " to org with id " + request.org);
            return await MemberService.createMember(request.user, request.org);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.delete(BASE_URL + '/:user/:org', async (req: FastifyRequest<{ Params: { user: number, org: number } }>, rep) => {
        const user = req.params.user;
        const org = req.params.org
        try {
            parseId(user)
            parseId(org)
            logger.info("Deleting membership of user with id " + user + " from org with id " + org);
            return await MemberService.deleteMemberById(user, org);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
