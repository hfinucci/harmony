import {z} from "zod";

const Request = z.object({
    name: z.string().optional(),
    image: z.string().optional(),
}).strict();

export function parseUpdateOrgRequest(payload: any) {
    return Request.parse(payload);
}

export type UpdateOrgRequest = z.infer<typeof Request>