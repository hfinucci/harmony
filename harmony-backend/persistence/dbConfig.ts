import { Pool } from 'pg';
import 'dotenv/config'
import { logger } from '../server';

const dbpool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    database: process.env.POSTGRES_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

const connectToDB = async () => {
    await dbpool.connect()
        .then(() => {
            logger.info('Connected to ' + process.env.POSTGRES_NAME + ' database');
        })
        .catch((err) => {
            logger.error("Error connecting to database")
            logger.error(err)
        })
}

export { dbpool, connectToDB }