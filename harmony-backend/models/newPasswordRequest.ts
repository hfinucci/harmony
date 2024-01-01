import {z} from "zod";

const Request = z.object({
    password: z.string(),
}).strict();

export function parseNewPasswordRequest(payload: any) {
    return Request.parse(payload);
}

export type NewPasswordRequest = z.infer<typeof Request>