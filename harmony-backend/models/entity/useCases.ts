import {z} from "zod";
import {ComposePersistence} from "../../persistence/composePersistence";
import {SongSession} from "./songSession";

const AppendRowValidator = z.object({
    operation: z.string().startsWith("appendRow"),
    songId: z.string(),
    userId: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type AppendRowRequest = z.infer<typeof AppendRowValidator>

const AppendBlockValidator = z.object({
    operation: z.string().startsWith("appendBlock"),
    songId: z.string(),
    userId: z.number(),
    row: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type AppendBlockRequest = z.infer<typeof AppendBlockValidator>

const EditBlockValidator = z.object({
    operation: z.string().startsWith("editBlock"),
    songId: z.string(),
    userId: z.number(),
    row: z.number(),
    col: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type EditBlockRequest = z.infer<typeof EditBlockValidator>

export interface ComposeUseCase {
    execute: (session: SongSession) => void;
    songId: string | undefined;
}

export class AppendRow implements ComposeUseCase {
    private request: AppendRowRequest | undefined;
    public songId: string | undefined;

    public parse(rawRequest: string): AppendRow | undefined {
        const response = AppendRowValidator.safeParse(rawRequest);
        if (response.success) {
            this.songId = response.data.songId;
            this.request = response.data;
            return this
        }
    }

    public async execute(session: SongSession) {
        const block = {
            chord: this.request?.chord!,
            lyrics: this.request?.lyrics!
        }
        const position = String(session.rowCount)
        const couldLock = await session.acquireIfPossible(this.request?.userId!, position)
        if (!couldLock) {
            return
        }
        await ComposePersistence.appendRow(this.request?.songId!, block)
        session.rowCount++
        await session.releaseLock(this.request?.userId!, position)
    }
}

export class AppendBlock implements ComposeUseCase {
    private request: AppendBlockRequest | undefined;
    public songId: string | undefined;

    public parse(rawRequest: string): ComposeUseCase | undefined {
        const response = AppendBlockValidator.safeParse(rawRequest);
        if (response.success) {
            this.request = response.data;
            this.songId = response.data.songId;
            return this
        }
    }

    public async execute(session: SongSession) {
        const block = {
            chord: this.request?.chord!,
            lyrics: this.request?.lyrics!
        }
        const position = String(this.request?.row!)
        const couldLock = await session.acquireIfPossible(this.request?.userId!, position)
        if (!couldLock) {
            return
        }
        await ComposePersistence.appendBlock(this.request?.songId!, this.request?.row!, block)
        await session.releaseLock(this.request?.userId!, position)
    }

}

export class EditBlock implements ComposeUseCase {
    private request: EditBlockRequest | undefined;
    public songId: string | undefined;

    public parse(rawRequest: string): ComposeUseCase | undefined {
        const response = EditBlockValidator.safeParse(rawRequest);
        if (response.success) {
            this.request = response.data
            this.songId = response.data.songId;
            return this
        }
    }

    public async execute(session: SongSession) {
        const block = {
            chord: this.request?.chord!,
            lyrics: this.request?.lyrics!
        }
        const position = String(this.request?.row!)
        const couldLock = await session.acquireIfPossible(this.request?.userId!, position)
        if (!couldLock) {
            return
        }
        await ComposePersistence.insertBlock(
            this.request?.songId!,
            this.request?.row!,
            this.request?.col!,
            block
        )
        await session.releaseLock(this.request?.userId!, position)
    }
}