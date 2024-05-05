import {SongSession} from "../models/entity/songSession";
import {ComposeRequestParser} from "../models/entity/composeRequestParser";

class SessionHandler {
    private static instance: SessionHandler;
    private sessions: Map<string, SongSession>

    private constructor() {
        this.sessions = new Map<string, SongSession>();
    }

    public static getInstance(): SessionHandler {
        if (!SessionHandler.instance) {
            SessionHandler.instance = new SessionHandler();
        }
        return SessionHandler.instance;
    }

    private async createSession(songId: string): Promise<SongSession> {
        const session = new SongSession(songId);
        this.sessions.set(songId, session);
        return session;
    }

    public async getSession(songId: string): Promise<SongSession | undefined> {
        if (!this.sessions.has(songId)) {
            return await this.createSession(songId)
        }
        return this.sessions.get(songId);
    }
}

export class ComposeService {
    private sessionHandler: SessionHandler;

    constructor() {
        this.sessionHandler = SessionHandler.getInstance();
    }

    public async processRequest(request: string) {
        const operation = ComposeRequestParser.parse(request)
        if (!operation) {
            throw new Error("Invalid operation")
        }
        const session = await this.sessionHandler.getSession(operation.songId!)
        operation.execute(session!);
    }
}