import {z} from "zod";

export const FetchAlbumsByUserResponse = z.object({
    id: z.number(),
    org: z.number(),
    name: z.string(),
}).strict();