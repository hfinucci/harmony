import {logger} from "../../server";
import {BlockMutex} from "./blockMutex";

export class SongSession {
    songId: string;
    blockMutex: Map<string, BlockMutex>
    rowCount: number
    contributors: Contributor[]

    constructor(songId: string) {
        this.songId = songId;
        this.blockMutex = new Map<string, BlockMutex>();
        this.rowCount = 0;
        this.contributors = [];
    }

    async acquireIfPossible(userId: number, position: string): Promise<boolean> {
        this.updateContributorsState(userId)
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

    updateContributorsState(userId: number) {
        this.addOrUpdateContributor(userId);
        this.purgeInactiveContributors()
    }

    addOrUpdateContributor(userId: number) {
        const contributor = this.contributors.find(contributor => contributor.userId === userId);
        if (contributor) {
            contributor.lastModified = new Date();
            return;
        }

        this.contributors.push(new Contributor(userId));
    }

    async releaseLock(userId: number, position: string): Promise<void> {
        this.blockMutex.get(position)?.release(userId);
    }

    purgeInactiveContributors() {
        const now = new Date();
        // Solo se queda con los ultimos 5 minutos
        this.contributors = this.contributors
            .filter(c => now.getTime() - c.lastModified.getTime() < 1000*60*5);

    }
}

export class Contributor {
    userId: number;
    lastModified: Date;

    constructor(userId: number) {
        this.userId = userId;
        this.lastModified = new Date();
    }
}