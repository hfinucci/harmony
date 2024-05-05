import server, {logger} from "./server";
import {connectToDB} from './persistence/dbConfig';
import {connectToMongoDB} from "./persistence/mongoConfig";
import {ComposePersistence} from "./persistence/composePersistence";

const ADDRESS = process.env.ADDRESS || '127.0.0.1'
const PORT = process.env.PORT || '3000'

logger.info("Starting server...")

server.listen({host: ADDRESS, port: parseInt(PORT, 10)}, async function (err: any, address: any) {
    if (err) {
        logger.error(err)
        process.exit(1)
    }
    await connectToDB()
    await connectToMongoDB()

    await ComposePersistence.initializeSession()
    // await ComposePersistence.appendBlock(
    //     "65fcbef8461488dff268d070",
    //     1,
    //     {chord: "G#", lyrics: "append"}
    // )
    // await ComposePersistence.appendRow(
    //     "65fcbef8461488dff268d070",
    //     {chord: "G#", lyrics: "append"}
    // )
    logger.info(`Server listening at ${address}`)
})