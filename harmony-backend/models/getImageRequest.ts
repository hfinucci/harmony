import {z} from "zod";

const Request = z.object({
    type: z.string(),
}).strict();

export function parseGetImageRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateOrgRequest = z.infer<typeof Request>