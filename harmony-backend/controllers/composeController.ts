import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";

const BASE_URL = '/api/socket'

export default async function composeController(fastify: FastifyInstance, opts: any) {
    let color_id = 2

    server.get('/chau', async (request, reply) => {
        return 'chau!\n'
    })

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
            ComposeService.initializeSession()
            logger.info(`sending color_id = ${color_id}`)
            socket.emit("color_id", color_id);
            color_id += 1
            logger.info(socket.id)
            socket.on("disconnect", () => {
                logger.info("a client has disconnected!")
            })
            socket.on("presskey", (payload) => {
                logger.info(payload)
                socket.broadcast.emit("presskey", payload);
            });
        });
    });
}
