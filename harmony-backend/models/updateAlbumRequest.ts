import {z} from "zod";

const Request = z.object({
    name: z.string().optional(),
}).strict();

export function parseUpdateAlbumRequest(payload: any) {
    return Request.parse(payload);
}

export type UpdateAlbumRequest = z.infer<typeof Request>