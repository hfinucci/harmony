import {BASE_URL} from "../App.tsx";

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
}