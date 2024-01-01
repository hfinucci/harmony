import {z} from "zod";

const Request = z.object({
    url: z.string(),
}).strict();

export function parseChangeIconRequest(payload: any) {
    return Request.parse(payload);
}

export type ChangeIconRequest = z.infer<typeof Request>