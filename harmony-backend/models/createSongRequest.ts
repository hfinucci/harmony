import {z} from "zod";

const Request = z.object({
    name: z.string(),
    author: z.string(),
}).strict();

export function parseCreateSongRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateSongRequest = z.infer<typeof Request>