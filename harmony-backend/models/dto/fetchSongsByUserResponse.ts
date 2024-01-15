import {z} from "zod";

export const FetchSongsByUserResponse = z.object({
    org: z.string(),
    song: z.string().nullable(),
    created: z.date(),
    lastmodified: z.date(),
}).strict();