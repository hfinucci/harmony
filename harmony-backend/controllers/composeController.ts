import {FastifyInstance, FastifyReply} from "fastify";
import server, { logger } from "../server";
import {ComposeService, Context} from "../service/composeService";
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

    server.ready().then(() => {
        server.io.on("connect", async (socket) => {
            logger.info("a new client has connected!")
            logger.info(socket.id)
            socket.on("disconnect", async () => {
                logger.info("a client has disconnected!")
            })
            socket.on("compose", async (payload) => {
                // logger.info("compose: " + payload)
                const context = await composeService.parseContext(payload)
                await composeService.joinRoom(socket, context)
                const response = await composeService.processRequest(payload)
                await composeService.emitToRoom(socket, "compose", response, context?.songId)
            })
            socket.on("session_established", async(request) => {
                await composeService.addOrUpdateContributor(request.userId, request.songId)
            })
            socket.on("contributors", async(songId) => {
                const response = await composeService.getContributors(songId)
                if (response) {
                    await composeService.emitToRoom(socket, "contributors", response, songId)
                    // socket.emit("contributors", response)
                }
            })
            socket.on("context", async(payload) => {
                const context = await composeService.parseContext(payload)
                await composeService.joinRoom(socket, context)
                await composeService.addOrUpdateContributor(Number(context?.userId), context?.songId!)
                const response = await composeService.getContributors( context?.songId!)
                await composeService.emitToRoom(socket, "contributors", response.toString(), context?.songId)
            })
            socket.on("clientMidi", async (payload: MIDIEvent) => {
                const context = {
                    songId: payload.composeId!,
                    userId: payload.userId.toString()
                } as Context
                await composeService.joinRoom(socket, context)
                await composeService.addOrUpdateContributor(payload.userId, payload.composeId)
                const response = await composeService.getContributors( context?.songId!)
                await composeService.emitToRoom(socket, "contributors", response.toString(), context?.songId)
                await composeService.emitToRoom(socket, "serverMidi", payload, payload.composeId)
                // socket.broadcast.emit("serverMidi", payload);
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
