import {z} from "zod";

const Request = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
}).strict();

export function parseCreateUserRequest(payload: any) {
    return Request.parse(payload);
}

export type CreateUserRequest = z.infer<typeof Request>