import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";
import {ComposePersistence} from "../persistence/composePersistence";

const BASE_URL = '/api/socket'

export default async function composeController(fastify: FastifyInstance, opts: any) {

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
            // await ComposePersistence.initializeSession()
            // await ComposePersistence.insertBlock({chord: "F#", lyrics: "hola mundo"})
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
