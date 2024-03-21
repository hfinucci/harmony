import {createClient} from 'redis';
import {logger} from "../server";

const redis = createClient();

const connectToRedis = async () => {
    logger.info("Creating redis connection")
    await redis.connect()
        .then(() => {
            logger.info('Connected to redis');
        })
        .catch((err) => {
            logger.error("Error connecting to redis")
            logger.error(err)
        })
}

export {redis, connectToRedis}