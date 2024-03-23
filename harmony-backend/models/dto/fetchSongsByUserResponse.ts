import {z} from "zod";

export const FetchSongsByUserResponse = z.object({
    id: z.number(),
    org: z.string(),
    name: z.string().nullable(),
    created: z.date(),
    lastmodified: z.date(),
}).strict();