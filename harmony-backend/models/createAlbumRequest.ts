import {z} from "zod";

const Request = z.object({
    name: z.string(),
    org: z.number(),
}).strict();

export function parseCreateAlbumRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateAlbumRequest = z.infer<typeof Request>