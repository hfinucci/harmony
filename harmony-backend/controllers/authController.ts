import {FastifyInstance} from 'fastify'
import server, {logger} from "../server";
import {AuthService} from '../service/authService';
import {parseAuthUserRequest} from '../models/authUserRequest';
import {parseNewPasswordRequest} from '../models/newPasswordRequest';
import {handleError} from '../utils';

const BASE_URL = '/api/auth/'

export default async function authController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseAuthUserRequest(req.body)
            logger.info("Signing in user with email: " + request.email);
            return await AuthService.signInWithPassword(request);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    // TODO: FIX
    server.post('/api/logout/', async (req, rep) => {
        try {
            logger.info("Signing out");
            return await AuthService.signOutUser();
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });

    // TODO: FIX
    server.put(BASE_URL, async (req, rep) => {
        try {
            const request = parseNewPasswordRequest(req.body)
            await AuthService.updatePassword(request)
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    })

}