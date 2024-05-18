import {Collection, MongoClient} from 'mongodb';
import {logger} from "../server";

const uri = 'mongodb://mongodb:27017';
const dbName = 'harmony';
const collectionName = "song"

const mongo = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await mongo.connect()
            .then(() => {
                logger.info('Connected to mongodb');
            })
            .catch((err) => {
                logger.error("Error connecting to mongodb")
                logger.error(err)
            })
    } catch (error) {
        console.error('Error connecting to the MongoDB server:', error);
    }
}

export { mongo, connectToMongoDB};