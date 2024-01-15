import {z} from "zod";
import {FastifyReply} from "fastify";
import {logger} from "./server";
import {AuthService, UserAuth} from "./service/authService";

const Request = z.object({
    id: z.number(),
}).strict();

export function parseId(id: any) {
    return z.number().int().positive().parse(+id)
}

export function handleError(err: any, rep: FastifyReply) {
    if (err instanceof z.ZodError) {
        return rep
            .code(400)
            .send()
    } else {
        return rep
            .code(404)
            .send()
    }
}

export async function parseJWT(bearerAuth: string, reply: FastifyReply) : Promise<UserAuth> {
    try {
        let token = bearerAuth.split(' ')[1];
        const jwtParts = token.split('.');
        if (jwtParts.length !== 3) {
            return { access_token: token, payload: null };
        }
        const payload = JSON.parse(atob(jwtParts[1]));
        token = await calculateTokenExpiration(payload, token);
        reply.header('session_token', `${token}`);
        return {
            access_token: token,
            payload: {
                name: payload.user_metadata.name,
                email: payload.user_metadata.email,
                id: payload.user_metadata.id
            }
        };
    } catch (error) {
        return { access_token: null, payload: null };
    }
}

async function calculateTokenExpiration(payload: any, token: string): Promise<string> {
    const now = Date.now() / 1000;
    const expiration = payload.exp;
    let maybeToken = token;
    try {
        if (expiration - now <= 30 * 60 * 1000) { // If token expires in less than 30 minutes
            logger.info("Refreshing token")
            maybeToken = await AuthService.refreshToken(token)
            logger.info(maybeToken)
        }
    } catch (error) {
        throw new Error('Token expired');
    }
    return maybeToken
}