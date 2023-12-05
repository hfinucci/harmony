import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { UserPersistence } from '../persistence/userPersistence';
import { AuthService } from '../service/authService';

const BASE_URL = '/api/user/'

export default async function userController(fastify: FastifyInstance, opts: any) {
    
    server.get(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        logger.info("Getting user with id: " + id);
        return {name:await UserPersistence.getUserName(id)};
    });

    server.post(BASE_URL, async (req: FastifyRequest<{Body: {email: string, password: string}}> , rep) => {
        const email = req.body.email;
        const password = req.body.password;
        logger.info("Signing up user with email: " + email);
        AuthService.signUpNewUser(email, password);
    });
}