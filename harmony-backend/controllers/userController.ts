import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server from "../server";

const BASE_URL = '/api/user'

export default async function userController(fastify: FastifyInstance, opts: any) {
    server.get(BASE_URL + '/', async (req, rep) => {
        return 'hola mundo!\n'
    });
}