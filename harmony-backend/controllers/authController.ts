import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { AuthService } from '../service/authService';


//TODO: Ya se que asi no se deberia hacer pero es un fix del momento
const BASE_URL = '/api/login/'

export default async function authController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req: FastifyRequest<{Body: {email: string, password: string}}> , rep) => {
        const email = req.body.email;
        const password = req.body.password;
        logger.info("Signing in user with email: " + email);
        const data = await AuthService.signInWithPassword(email, password);
        if(data.user?.id == undefined)
            return false;
        return true;
    });

}