import {Mutex, Semaphore, withTimeout} from 'async-mutex';
import {logger} from "../../server";
import {BlockMutex} from "./blockMutex";

export class SongSession {
    songId: string;
    blockMutex: Map<string, BlockMutex>
    rowCount: number

    constructor(songId: string) {
        this.songId = songId;
        this.blockMutex = new Map<string, BlockMutex>();
        this.rowCount = 0;
    }

    async acquireIfPossible(userId: number, position: string): Promise<boolean> {
        if (!this.blockMutex.has(position)) {
            const blockMutex = new BlockMutex();
            await blockMutex.acquire(userId);
            this.blockMutex.set(position, blockMutex);
            return true
        }
        if (this.blockMutex.get(position)?.isLocked(userId)) {
            logger.info(`Song ${this.songId} mutex is already in use`)
            return false;
        }
        await this.blockMutex.get(position)?.acquire(userId);
        return true;
    }

    async releaseLock(userId: number, position: string): Promise<void> {
        this.blockMutex.get(position)?.release(userId);
    }


}