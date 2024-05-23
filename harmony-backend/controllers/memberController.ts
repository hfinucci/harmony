import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {MemberService} from '../service/memberService';
import {handleError, parseId} from "../utils";
import {parseCreateMemberRequest} from "../models/createMemberRequest";
import {OrgService} from "../service/orgService";
import {AuthService} from "../service/authService";
import {MailService} from "../service/mailService";
import {parseSendJoinOrgRequest} from "../models/sendJoinOrgRequest";
import {UserService} from "../service/userService";

const BASE_URL = '/api/members'

export default async function memberController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateMemberRequest(req.body);
            const user = AuthService.parseJWT(req.headers.authorization)
            if (user.person != null) {
                if (user.person.email !== request.user) {
                    logger.error("Logged user id does not match user id in request");
                    return rep
                        .code(403)
                        .send()
                }
                logger.info("Adding user " + user.person.name + " to organization: " + request.org);
                return await MemberService.createMember(user.person.id, request.org);
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

    server.post(BASE_URL + '/request', async (req, rep) => {
        try {
            const request = parseSendJoinOrgRequest(req.body);
            const user = AuthService.parseJWT(req.headers.authorization)
            if (user.person != null) {
                const futureMember = await UserService.getUserByEmail(request.user);
                if (futureMember == null) {
                    logger.error("User not found: " + request.user);
                    return rep
                        .code(404)
                        .send()
                }
                logger.info("Sending request to join organization: " + request.org);
                return await MailService.sendJoinOrgRequestMail(request.user, request.org);
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
            const loggedUser = AuthService.parseJWT(req.headers.authorization)
            parseId(user)
            parseId(org)

            logger.info("Checking if user with id " + user + " is a member of org with id " + org);
            await MemberService.getMembership(user, org);

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
