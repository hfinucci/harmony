import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";
import {ComposePersistence} from "../persistence/composePersistence";

const BASE_URL = '/api/socket'

export default async function composeController(fastify: FastifyInstance, opts: any) {

    const composeService = new ComposeService()

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
            // await ComposePersistence.initializeSession()
            // await ComposePersistence.insertBlock({chord: "F#", lyrics: "hola mundo"})
            logger.info(socket.id)
            socket.on("disconnect", () => {
                logger.info("a client has disconnected!")
            })
            socket.on("compose", async (payload) => {
                const response = await composeService.processRequest(payload)
                if (response !== undefined || response !== "") {
                    socket.emit("compose", response)
                }
            })
            socket.on("presskey", (payload) => {
                logger.info(payload)
                socket.broadcast.emit("presskey", payload);
            });
        });
    });
}
