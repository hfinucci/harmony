const BASE_URL = "http://127.0.0.1:3000";

export class OrgService {

    public static async getOrg(id: number) {
        return await fetch(BASE_URL + "/api/org/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getOrgMembers(id: number) {
        return await fetch(BASE_URL + "/api/org/" + id + "/members", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getOrgSongs(id: number) {
        return await fetch(BASE_URL + "/api/org/" + id + "/songs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async deleteOrg(id: number) {
        return await fetch(BASE_URL + "/api/org/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async createOrg(name: string) {
        return await fetch(BASE_URL + "/api/org", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('harmony-jwt') as string
            },
            body: JSON.stringify({
                name: name
            }),
        }).then((response) => {
            return response;
        });
    }
}