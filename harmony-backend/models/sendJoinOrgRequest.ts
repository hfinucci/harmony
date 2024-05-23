import {z} from "zod";

const Request = z.object({
    user: z.string()
        .email({message: "Invalid email address"}),
    org: z.number({
        required_error: "Organization ID is required",
        invalid_type_error: "Organization ID must be a number",
    })
        .positive({message: "Organization ID must be positive"})
        .int({message: "Organization ID must be an integer"}),
}).strict();

export function parseSendJoinOrgRequest(payload: any) {
    return Request.parse(payload);
}

export type SendJoinOrgRequest = z.infer<typeof Request>