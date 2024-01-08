import {z} from "zod";

const Request = z.object({
    user: z.number(),
    org: z.number(),
}).strict();

export function parseCreateMemberRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateMemberRequest = z.infer<typeof Request>