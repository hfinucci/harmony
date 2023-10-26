import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { UserPersistence } from '../persistence/userPersistence';

const BASE_URL = '/api/user/'

export default async function userController(fastify: FastifyInstance, opts: any) {
    
    server.get(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        logger.info("Getting user with id: " + id);
        return await UserPersistence.getUserName(id);
    });
}