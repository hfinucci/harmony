import { Pool } from 'pg';
import 'dotenv/config'
import { logger } from '../server';

const dbpool = new Pool({
    user: process.env.DB_USER,
    host: '127.0.0.1',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

const connectToDB = async () => {
    await dbpool.connect()
        .then(() => {
            logger.info('Connected to ' + process.env.DB_NAME + ' database');
        })
        .catch((err) => {
            logger.error("Error connecting to database")
            logger.error(err)
        })
}

export { dbpool, connectToDB }