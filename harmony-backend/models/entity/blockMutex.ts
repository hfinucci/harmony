import {Mutex, Semaphore, withTimeout} from 'async-mutex';
import {logger} from "../../server";

export class BlockMutex {
    userId: number | undefined;
    mutex: Mutex

    constructor() {
        this.mutex = new Mutex();
    }

    public async acquire(userId: number) {
        if (this.userId === userId) {
            return
        }
        await this.mutex.acquire();
        this.userId = userId;
    }

    public async notMine(userId: number): Promise<boolean> {
        return this.userId !== userId && this.mutex.isLocked()
    }

    public async release(userId: number) {
        if (this.userId === userId) {
            this.mutex.release();
            this.userId = undefined;
        }
    }
}