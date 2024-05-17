import { FastifyInstance } from "fastify";
import server, { logger } from "../server";

const BASE_URL = '/api/socket'

// export default async function socketController(fastify: FastifyInstance, opts: any) {
//     let color_id = 2
//
//     server.get('/chau', async (request, reply) => {
//         return 'chau!\n'
//     })
//
//     server.ready().then(() => {
//         server.io.on("connect", (socket) => {
//             logger.info("a new client has connected!")
//             logger.info(`sending color_id = ${color_id}`)
//             socket.emit("color_id", color_id);
//             color_id += 1
//             logger.info(socket.id)
//             socket.on("disconnect", () => {
//                 logger.info("a client has disconnected!")
//             })
//             socket.on("presskey", (payload) => {
//                 logger.info(payload)
//                 socket.emit("presskey", payload);
//             });
//             socket.on("clientMidi", (payload) => {
//                 logger.info(payload);
//                 socket.broadcast.emit("serverMidi", payload);
//             });
//         });
//     });
// }
