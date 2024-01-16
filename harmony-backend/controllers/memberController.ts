import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {MemberService} from '../service/memberService';
import {handleError, parseId, parseJWT} from "../utils";
import {parseCreateMemberRequest} from "../models/createMemberRequest";
import {OrgService} from "../service/orgService";

const BASE_URL = '/api/member'

export default async function memberController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateMemberRequest(req.body);
            const user = parseJWT(req.headers.authorization || "")
            if (user.payload != null) {
                logger.info("Adding user " + user.payload.name + " to organization: " + request.org);
                return await MemberService.createMember(user.payload.id, request.org);
            }
            logger.info("No user logged in");
            return rep
                .code(403)
                .send()
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
            const info = await MemberService.deleteMemberById(user, org);
            const members = await MemberService.getMembersByOrg(org);
            if(members.length === 0)
                return await OrgService.deleteOrgById(org)
            return info;
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
