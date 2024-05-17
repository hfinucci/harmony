import { FastifyInstance } from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";
import {Block, ComposePersistence} from "../persistence/composePersistence";
import {SongService} from "../service/songService";
import {handleError} from "../utils";

const BASE_URL = '/api/compose'

interface Note {
    on: number;
    pitch: number;
    velocity: number;
}

interface MIDIEvent {
    songId: string;
    userId: number;
    note: Note;
}


export default async function composeController(fastify: FastifyInstance, opts: any) {

    const composeService = new ComposeService()
    let color_id = 2

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
            logger.info(`sending color_id = ${color_id}`)
            socket.emit("colorId", "colorcito");
            color_id += 1
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
            socket.on("contributors", async(songId) => {
                const response = await composeService.getContributors(songId)
                if (response) {
                    socket.emit("contributors", response)
                }
            })
            socket.on("clientMidi", async (payload: MIDIEvent) => {
                logger.info(payload);
                const resposen = await composeService.addOrUpdateContributor(payload.userId, payload.songId)
                socket.emit("serverMidi", payload);
            });
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
