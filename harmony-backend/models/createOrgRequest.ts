import {z} from "zod";

const MAX_SIZE = 1024 * 1024 * 4; // 4MB

const Request = z.object({
    name: z.string(),
    image: z.string().nullable().optional()
}).strict();

export function parseCreateOrgRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateOrgRequest = z.infer<typeof Request>