import {z} from "zod";
import {FastifyReply} from "fastify";

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
