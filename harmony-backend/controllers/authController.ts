import {FastifyInstance} from 'fastify'
import server, {logger} from "../server";
import {AuthService, UserAuth} from '../service/authService';
import {parseAuthUserRequest} from '../models/authUserRequest';
import {parseNewPasswordRequest} from '../models/newPasswordRequest';
import {handleError} from '../utils';

const BASE_URL = '/api/auth'

export default async function authController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseAuthUserRequest(req.body)
            logger.info("Signing in user with email: " + request.email);
            return await AuthService.login(request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    server.post(BASE_URL + '/password', async (req, rep) => {
        try {
            const request = parseNewPasswordRequest(req.body);
            const userAuth: UserAuth = AuthService.parseJWT(req.headers.authorization)
            await AuthService.updatePassword(request, userAuth)
        } catch (err) {
            return handleError(err, rep)
        }
    })

}