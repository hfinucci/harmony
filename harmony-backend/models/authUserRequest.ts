import {z} from "zod";

const Request = z.object({
    email: z.string(),
    password: z.string(),
}).strict();

export function parseAuthUserRequest(payload: any) {
    return Request.parse(payload);
}

export type AuthUserRequest = z.infer<typeof Request>