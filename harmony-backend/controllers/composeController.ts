import {FastifyInstance, FastifyReply} from "fastify";
import server, { logger } from "../server";
import {ComposeService} from "../service/composeService";
import {Block} from "../persistence/composePersistence";
import {SongService} from "../service/songService";
import {handleError} from "../utils";

const BASE_URL = '/api/compose'

interface Note {
    on: number;
    pitch: number;
    velocity: number;
}

interface MIDIEvent {
    composeId: string;
    userId: number;
    note: Note;
}


export default async function composeController(
    fastify: FastifyInstance,
    opts: any
) {

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
                logger.info("compose: " + payload)
                const response = await composeService.processRequest(payload)
                if (response !== undefined || response !== "") {
                    socket.broadcast.emit("compose", response)
                }
            })
            socket.on("contributors", async(songId) => {
                logger.info("Getting contributors for song with id: " + songId)
                const response = await composeService.getContributors(songId)
                logger.info("Contributors: " + response.contributors)
                if (response) {
                    socket.emit("contributors", response)
                }
            })
            socket.on("clientMidi", async (payload: MIDIEvent) => {
                logger.info(payload);
                await composeService.addOrUpdateContributor(payload.userId, payload.composeId)
                socket.broadcast.emit("serverMidi", payload);
            });
        });
    });

    server.get(BASE_URL + "/:id/blocks", async (req: any, rep: any) : Promise<Block[][] | FastifyReply> => {
        const id = req.params.id;
        try {
            logger.info("Fetching song blocks: " + id);
            return await SongService.getSongBlocksById(id);
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    })
}
