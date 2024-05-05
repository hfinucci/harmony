import {z} from "zod";
import {ComposePersistence} from "../../persistence/composePersistence";
import {SongSession} from "./songSession";

const AppendRowValidator = z.object({
    operation: z.string().startsWith("appendRow"),
    songId: z.number(),
    userId: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type AppendRowRequest = z.infer<typeof AppendRowValidator>

const AppendBlockValidator = z.object({
    operation: z.string().startsWith("appendBlock"),
    songId: z.number(),
    userId: z.number(),
    row: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type AppendBlockRequest = z.infer<typeof AppendBlockValidator>

const EditBlockValidator = z.object({
    operation: z.string().startsWith("editBlock"),
    songId: z.number(),
    userId: z.number(),
    row: z.number(),
    col: z.number(),
    lyrics: z.string(),
    chord: z.string()
}).strict();
export type EditBlockRequest = z.infer<typeof EditBlockValidator>

export interface ComposeUseCase {
    execute: (session: SongSession) => void;
    songId: number | undefined;
}

export class AppendRow implements ComposeUseCase {
    private request: AppendRowRequest | undefined;
    public songId: number | undefined;

    public parse(rawRequest: string): AppendRow | undefined {
        const response = AppendRowValidator.safeParse(rawRequest);
        if (response.success) {
            let toReturn = new AppendRow()
            toReturn.request = response.data;
            this.songId = response.data.songId;
            return toReturn
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
        await ComposePersistence.appendRow(String(this.request?.songId), block)
        session.rowCount++
        await session.releaseLock(this.request?.userId!, position)
    }
}

export class AppendBlock implements ComposeUseCase {
    private request: AppendBlockRequest | undefined;
    public songId: number | undefined;

    public parse(rawRequest: string): ComposeUseCase | undefined {
        const response = AppendBlockValidator.safeParse(rawRequest);
        if (response.success) {
            let toReturn = new AppendBlock()
            toReturn.request = response.data;
            toReturn.request = response.data;
            this.songId = response.data.songId;
            return toReturn
        }
    }

    public async execute(session: SongSession) {
        const block = {
            chord: this.request?.chord!,
            lyrics: this.request?.lyrics!
        }
        // Para saber que position, primero bloqueo row/col y luego valido contra el mongo si es la posición correcta.
        //  Si no lo es, releaseo el lock y vuelvo a intentar con la prox
        // Por otro lado, tambien puedo bloquear toda la row y a la mierda, pero en el caso del append row que hago?
        // Podria lockear la tabla entera?
        const position = String(this.request?.row!)
        const couldLock = await session.acquireIfPossible(this.request?.userId!, position)
        if (!couldLock) {
            return
        }
        await ComposePersistence.appendBlock(String(this.request?.songId), this.request?.row!, block)
        await session.releaseLock(this.request?.userId!, position)
    }

}

export class EditBlock implements ComposeUseCase {
    private request: EditBlockRequest | undefined;
    public songId: number | undefined;

    public parse(rawRequest: string): ComposeUseCase | undefined {
        const response = EditBlockValidator.safeParse(rawRequest);
        if (response.success) {
            let toReturn = new EditBlock()
            toReturn.request = response.data;
            toReturn.request = response.data;
            this.songId = response.data.songId;
            return toReturn
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
            String(this.request?.songId),
            this.request?.row!,
            this.request?.col!,
            block
        )
        await session.releaseLock(this.request?.userId!, position)
    }
}