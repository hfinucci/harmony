import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";
import {Block, ComposePersistence} from "../persistence/composePersistence";
import {SongService} from "../service/songService";
import {handleError} from "../utils";

const BASE_URL = '/api/compose'

export default async function composeController(fastify: FastifyInstance, opts: any) {

    const composeService = new ComposeService()

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
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

    server.get(BASE_URL + "/:id/blocks", async (req: any, rep: any) : Promise<Block[][]> => {
        const id = req.params.id;
        try {
            logger.info("Fetching song blocks: " + req.name);
            return await SongService.getSongBlocksById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    })
}
