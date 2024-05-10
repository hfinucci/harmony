import {z} from "zod";

const MAX_SIZE = 1024 * 1024 * 4;

const Request = z.object({
    id: z.number(),
    image: z.any()
        .refine((file) => file?.size <= MAX_SIZE, "Image is too large")
        .refine((file) => file?.type.startsWith("image/"), "Image is not an image")
}).strict();

export function parseUpdateOrgImageRequest(payload: any) {
    return Request.parse(payload);
}

export type UpdateOrgImageRequest = z.infer<typeof Request>;