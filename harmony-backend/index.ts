import server, { logger } from "./server";
import { connectToDB } from './persistence/dbConfig';
import {connectToRedis} from "./persistence/redisConfig";
import {connectToMongoDB} from "./persistence/mongoConfig";

const ADDRESS = process.env.ADDRESS || '127.0.0.1'
const PORT = process.env.PORT || '3000'

logger.info("Starting server...")

// Missing top level await. Server may be started before DB connection is established.
connectToDB()

server.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, function (err: any, address: any) {
  if (err) {
    logger.error(err)
    process.exit(1)
  }
  logger.info(`Server listening at ${address}`)
})