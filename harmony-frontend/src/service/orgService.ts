const BASE_URL = "http://127.0.0.1:3000";

export class OrgService {
    public static async getOrg(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getOrgMembers(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id + "/members", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getOrgSongs(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id + "/songs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async deleteOrg(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async editOrg(
        id: number,
        name: string,
        image: string | null
    ) {
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                image: image,
            }),
        });
    }

    public static async createOrg(name: string, image: string | null) {
        return await fetch(BASE_URL + "/api/orgs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: ("Bearer " +
                    localStorage.getItem("harmony-jwt")) as string,
            },
            body: JSON.stringify({
                name: name,
                image: image,
            }),
        });
    }
}
