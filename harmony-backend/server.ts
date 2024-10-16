import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyIO from "fastify-socket.io";
import composeController from './controllers/composeController';
import userController from './controllers/userController';
import songController from './controllers/songController';
import pino from 'pino';
import authController from './controllers/authController';
import orgController from "./controllers/orgController";
import memberController from "./controllers/memberController";
import imageController from "./controllers/imageController";
import albumController from "./controllers/albumController";
import searchController from "./controllers/searchController";

const server = fastify()
    .register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
    .register(fastifyIO, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    })
    .register(userController)
    .register(authController)
    .register(composeController)
    .register(songController)
    .register(orgController)
    .register(memberController)
    .register(imageController)
    .register(searchController)
    .register(albumController);

const transport = pino.transport({
    targets: [
        {
            level: "trace",
            target: "pino-pretty",
            options: {},
        },
        {
            level: "trace",
            target: "pino/file",
            options: {
                destination: "./logs/harmony-backend.log",
            },
        },
    ],
});

export default server;
export const logger = pino(transport);
