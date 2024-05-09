export function buildLockedMutexResponse(): string {
    return JSON.stringify({message: "Resource is locked by another user"})
}

export function buildInvalidRequestResponse(): string {
    return JSON.stringify({message: "Invalid request"})
}