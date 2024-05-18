const BASE_URL = "http://127.0.0.1:3000";

export class MemberService {
    public static async createMembership(oid: number) {
        return await fetch(BASE_URL + "/api/members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
            body: JSON.stringify({
                org: oid,
            })
        })
    }

    public static async deleteMembership(oid: number) {
        const uid = localStorage.getItem('harmony-uid') as string
        return await fetch(BASE_URL + "/api/members/" + uid +"/" + oid, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
        })
    }
}
