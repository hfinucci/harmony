import {Contributor, SongSession} from "../models/entity/songSession";
import {ComposeRequestParser} from "../models/entity/composeRequestParser";
import {buildInvalidRequestResponse} from "../models/errors/composeErrors";
import {UserService} from "./userService";

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

    public async processRequest(request: string): Promise<string>{
        const operation = ComposeRequestParser.parse(request)
        if (!operation) {
            return buildInvalidRequestResponse()
        }
        const session = await this.sessionHandler.getSession(operation.songId!)
        return await operation.execute(session!);
    }

    public async getContributors(songId: string) : Promise<{contributors: object[] | undefined}> {
        const session = await this.sessionHandler.getSession(songId)
        session?.purgeInactiveContributors()
        const contributors = session?.contributors as Contributor[]
        let users = []
        for (const s of contributors) {
            const u = await UserService.getUserById(s.userId)
            users.push(
                {
                    ...u,
                    image:
                        process.env.IMAGE_PATH  + "profile_images/" +
                        u.image,
                }
            )
        }
        return { contributors: users }
    }

    public async addOrUpdateContributor(userId: number, songId: string) {
        const session = await this.sessionHandler.getSession(songId)
        session?.addOrUpdateContributor(userId)
    }

}