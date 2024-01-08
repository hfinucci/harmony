import {z} from "zod";

const Request = z.object({
    name: z.string(),
}).strict();

export function parseCreateOrgRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateOrgRequest = z.infer<typeof Request>