import {z} from "zod";

const Request = z.object({
    image: z.string().regex(new RegExp(/^(cow|dolphin|giraffe|leopard|lion|swan).png/)),
}).strict();

export function parseChangeIconRequest(payload: any) {
    return Request.parse(payload);
}

export type ChangeIconRequest = z.infer<typeof Request>