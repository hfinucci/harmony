import {mongo} from "./mongoConfig";
import {Collection, InsertOneResult, ObjectId} from "mongodb";
import {logger} from "../server";

interface Block {
    chord: string;
    lyrics: string;
}

interface Song {
    _id: string | ObjectId | null; // No me juzgues no sabes por lo que pase
    blocks: Block[][];
}

const dbName = 'harmony';
const collectionName = "song"

export class ComposePersistence {

    private static collection: Collection<Song>;

    public static async initializeSession(): Promise<any> {
        const db = mongo.db(dbName);
        this.collection = db.collection(collectionName);
    }

    public static async insertBlock(songId: string, row: number, col: number, block: Block,): Promise<any> {
        const song = await this.collection.findOne({_id: new ObjectId(songId)});
        if (song) {
            if (song.blocks[row]) {
                if (song.blocks[row][col]) {
                    song.blocks[row][col] = block;
                } else {
                    song.blocks[row] = [block];
                }
            } else {
                song.blocks[row] = [];
                song.blocks[row][col] = block;
            }
            await this.collection.updateOne({_id: new ObjectId(songId)}, {$set: {blocks: song.blocks}});
            logger.info(`Block saved to Song ${songId} at row ${row} and column ${col}`);
        } else {
            const newSong: Song = {
                _id: null,
                blocks: [[]]
            };
            newSong.blocks[row] = [];
            newSong.blocks[row][col] = block;
            const insertOneResult: InsertOneResult<Song> = await this.collection.insertOne(newSong)
            logger.info(`Song ${insertOneResult.insertedId} created with block at row ${row} and column ${col}`);
        }
    }

    public static async appendRow(songId: string, block: Block): Promise<number> {
        const song = await this.collection.findOne({ _id: new ObjectId(songId) });
        let rowCount = 1
        if (song) {
            song.blocks.push([block]);
            await this.collection.updateOne({ _id: new ObjectId(songId) }, { $set: { blocks: song.blocks } });
            logger.info(`New row appended to Song ${songId}`);
            rowCount = song.blocks.length
            return rowCount
        } else {
            const newSong: Song = {
                _id: null,
                blocks: [[block]]
            };
            const insertOneResult: InsertOneResult<Song> = await this.collection.insertOne(newSong)
            logger.info(`Song ${insertOneResult.insertedId} created with appended block`);
            return rowCount
        }
    }

    public static async appendBlock(songId: string, row: number, block: Block): Promise<any> {
        const song = await this.collection.findOne({ _id: new ObjectId(songId) });
        if (song) {
            if (song.blocks[row]) {
                song.blocks[row].push(block);
            } else {
                song.blocks[row] = [block];
            }
            const rowCount = song.blocks[row].length
            await this.collection.updateOne({ _id: new ObjectId(songId) }, { $set: { blocks: song.blocks } });
            logger.info(`Block appended to Song ${songId} at row ${row}`);
        } else {
            const newSong: Song = {
                _id: null,
                blocks: [[]]
            };
            newSong.blocks[row] = [block];
            const insertOneResult: InsertOneResult<Song> = await this.collection.insertOne(newSong)
            logger.info(`Song ${insertOneResult.insertedId} created with block at row ${row}`);
        }
    }

    public static async getRowCount(songId: string): Promise<number> {
        const song = await this.collection.findOne({ _id: new ObjectId(songId) });
        if (song) {
            return song.blocks.length;
        } else {
            return 0;
        }
    }
}