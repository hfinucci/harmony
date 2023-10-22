import fastify from 'fastify';
import cors from '@fastify/cors'
import fastifyIO from "fastify-socket.io";
import socketController from './controllers/sockerController';
import userController from './controllers/userController';
import pino from 'pino';

const server = fastify()
    .register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
    .register(fastifyIO, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        }
    })
    .register(userController)
    .register(socketController)

const transport = pino.transport({
    targets: [
        {
            level: 'trace',
            target: 'pino-pretty',
            options: {},
        },
        {
            level: 'trace',
            target: 'pino/file',
            options: {
                destination: './logs/harmony-backend.log',
            },
        }
    ],
});

export default server;
export const logger = pino(transport);