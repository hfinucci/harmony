import {z} from "zod";

const Request = z.object({
    name: z.string().optional(),
    album: z.number().optional().nullable()
}).strict();

export function parseUpdateSongRequest(payload: any) {
    return Request.parse(payload);
}

export type UpdateSongRequest = z.infer<typeof Request>