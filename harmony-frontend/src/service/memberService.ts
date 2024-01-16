const BASE_URL = "http://127.0.0.1:3000";

export class MemberService {
    public static async deleteMembership(oid: number) {
        const uid = localStorage.getItem('harmony-uid') as string
        return await fetch(BASE_URL + "/api/member/" + uid +"/" + oid, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((response) => {
            return response;
        });
    }
}
