import {z} from "zod";
import {FastifyReply} from "fastify";
import {logger} from "./server";
import {UserAuth} from "./service/authService";

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

export function parseJWT(bearerAuth: string) : UserAuth {
    try {
        const token = bearerAuth.split(' ')[1];
        const jwtParts = token.split('.');
        if (jwtParts.length !== 3) {
            return { access_token: token, payload: null };
        }
        const payload = JSON.parse(atob(jwtParts[1]));
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
