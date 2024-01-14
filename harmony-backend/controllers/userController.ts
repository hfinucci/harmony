import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {AuthService, UserAuth} from '../service/authService';
import {UserService} from '../service/userService';
import {parseCreateUserRequest} from '../models/createUserRequest';
import {parseChangeIconRequest} from '../models/changeIconRequest';
import {handleError, parseId, parseJWT} from '../utils';
import {UserResponse} from "@supabase/supabase-js";
import {MemberService} from "../service/memberService";

const BASE_URL = '/api/user'

export default async function userController(fastify: FastifyInstance, opts: any) {

    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Getting user with id: " + id);
            return await UserService.getUserById(id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
    });

    server.get(BASE_URL + '/:id/orgs', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Getting orgs from user with id: " + id);
            return await MemberService.getOrgsByUser(id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
    });

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateUserRequest(req.body)
            logger.info("Signing up user with email: " + request.email);
            const userData = await UserService.createUser(request.email, request.name);
            const data = await AuthService.signUpNewUser(request, userData.id);
            if (data.access_token == null) {
                return rep
                    .code(409)
                    .send()
            }
            return data
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }

    });


    // TODO FIX DELETE USER
    server.delete(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            const userAuth: UserAuth = parseJWT(req.headers.authorization || "")
            if (userAuth.access_token == null) {
                return rep
                    .code(401)
                    .send()
            }
            const supabaseReponse: UserResponse = await AuthService.getLoggedUser(userAuth.access_token)
            logger.info(supabaseReponse)
            const auth_id = supabaseReponse.data.user?.id;
            if (auth_id == null) {
                logger.info("User with supabase Id " + id + " not found")
                return rep
                    .code(404)
                    .send()
            } else {
                await AuthService.deleteUser(auth_id);
            }
            logger.info("Successfully delete supabase user")
            logger.info("Trying to delete user from database")
            return await UserService.deleteUserById(id);
        } catch (err) {
            logger.info(err);
            return handleError(err, rep)
        }
    })

    server.put(BASE_URL + '/:id', async (req: FastifyRequest<{ Params: { id: number } }>, rep) => {
        try {
            const id = req.params.id
            parseId(id)
            const request = parseChangeIconRequest(req.body)
            logger.info("Changing image for user with id " + id)
            return await UserService.changeIcon(id, request)
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }

    })

    server.get(BASE_URL + '/:id' + "/songs", async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Getting songs with id: " + id);
            return await UserPersistence.getUserWithID(id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
    });
}