import {Contributor, SongSession} from "../models/entity/songSession";
import {ComposeRequestParser} from "../models/entity/composeRequestParser";
import {buildInvalidRequestResponse} from "../models/errors/composeErrors";
import {UserService} from "./userService";
import {logger} from "../server";
import {Socket} from "socket.io";

class SessionHandler {
    private static instance: SessionHandler;
    public sessions: Map<string, SongSession>
    private rooms: Map<string, string[]>

    private constructor() {
        this.sessions = new Map<string, SongSession>();
        this.rooms = new Map<string, string[]>;
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

    public addUserToRoom(roomId: string, userId: string, socket: Socket): void {
        const users = this.rooms.get(roomId) || [];
        if (!users.includes(userId)) {
            users.push(userId);
            this.rooms.set(roomId, users);
        }
        // console.log('**********');
        // for (const [songId, userIds] of this.rooms.entries()) {
        //     console.log(`Song ID: ${songId}`);
        //     console.log(`User IDs: ${userIds.join(', ')}`);
        //     console.log('------------------');
        // }
    }

    public invalidateUserSessions(userId: string, socket: Socket): string[] {
        const oldRooms: string[] = [];
        for (const [songId, userIds] of this.rooms.entries()) {
            if (userIds.includes(userId)) {
                logger.info("MATCH: songId: " + songId)
                oldRooms.push(songId);
                const updatedUserIds = userIds.filter((id) => id !== userId);
                this.rooms.set(songId, updatedUserIds);
            }
        }

        for (const songId of oldRooms) {
            const session = this.sessions.get(songId);
            if (session) {
                session.contributors = session.contributors.filter(
                    (contributor) => contributor.userId !== Number(userId)
                );
            }
        }
        return oldRooms
    }

    public getRoomByUserId(userId: string) {
        for (const [songId, userIds] of this.rooms.entries()) {
            if (userIds.includes(userId)) {
                return songId; // Return the first songId where the userId is found
            }
        }
        return undefined;
    }
}

export interface Context {
    songId: string,
    userId: string
}

export class ComposeService {
    private sessionHandler: SessionHandler;

    constructor() {
        this.sessionHandler = SessionHandler.getInstance();
    }

    public async parseContext(request: string): Promise<Context | undefined> {
        try {
            const operation = JSON.parse(request.toString());
            return {
                songId: operation.songId,
                userId: operation.userId
            } as Context
        } catch (e) {
            logger.info("Error parsing context: " + e)
            return undefined;
        }
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
            users.push(u);
        }
        return { contributors: users }
    }

    public async addOrUpdateContributor(userId: number, songId: string) {
        const session = await this.sessionHandler.getSession(songId)
        session?.addOrUpdateContributor(userId)
    }

    public async leaveRooms(socket: Socket) {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                await socket.leave(room);
            }
        }
    }

    public async joinRoom(socket: Socket, context?: Context) {
        const oldRooms = this.sessionHandler.invalidateUserSessions(context?.userId!, socket)
        for (const roomId of oldRooms) {
            const contributors = await this.getContributors(roomId)
            logger.info("CONTRIBUTORS DE LA ROOM ANTERIOR songid: " + roomId + " contributors: " + JSON.stringify(contributors))
            await this.emitToRoom(socket, "contributors", contributors.toString(), roomId)
        }
        await this.leaveRooms(socket)
        await socket.join(context?.songId!);
        this.sessionHandler.addUserToRoom(context?.songId!, context?.userId!, socket)
        const contributors = await this.getContributors(context?.songId!)
        logger.info('**********');
        for (const [songId, session] of this.sessionHandler.sessions.entries()) {
            logger.info(`Song ID: ${songId}`);
            logger.info(`Contributors IDs: ${session.contributors.join(', ')}`);
            logger.info('------------------');
        }
        logger.info("CONTRIBUTORS DE LA ROOM ACTUAL songid: " + context?.songId! + " contributors: " + JSON.stringify(contributors))
        await this.emitToRoom(socket, "contributors", contributors.toString(), context?.songId!)
    }

    public async emitToRoom(socket: Socket, channel: string, response: any, roomId?: string) {
        if (roomId && response !== undefined && response !== "") {
            socket.to(roomId).emit(channel, response)
        }
    }
}