import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { AuthService } from '../service/authService';
import { UserService } from '../service/userService';
import { parseAuthUserRequest } from '../models/authUserRequest';
import {z} from "zod";
import { parseNewPasswordRequest } from '../models/newPasswordRequest';

//TODO: Ya se que asi no se deberia hacer pero es un fix del momento
const BASE_URL = '/api/auth/'

export default async function authController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseAuthUserRequest(req.body)
            logger.info("Signing in user with email: " + request.email);
            return await AuthService.signInWithPassword(request);
        } catch (err) {
            logger.error(err)
            if (err instanceof z.ZodError) {
                return rep
                    .code(400)
                    .send()
            } else {
                return rep
                    .code(409)
                    .send()
            }
        }
        
    });

    server.get(BASE_URL, async (req, rep) => {
        try {
            const auth_data = await AuthService.getLoggedUser();
            let data = null
            if(auth_data != undefined && auth_data.user != null ) {
                data = UserService.getUser(auth_data.user?.id)
            }
            return data
        } catch (err) {
            logger.error(err)
            return rep
                .code(404)
                .send()
        }  
    });

    server.put(BASE_URL, async (req, rep) => {
        try {
            const request = parseNewPasswordRequest(req.body)
            await AuthService.updatePassword(request)
        } catch (err) {
            logger.error(err)
            if (err instanceof z.ZodError) {
                return rep
                    .code(400)
                    .send()
            } else {
                return rep
                    .code(409)
                    .send()
            }
        }
    })

}