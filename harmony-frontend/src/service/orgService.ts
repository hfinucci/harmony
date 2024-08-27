const BASE_URL = "http://127.0.0.1:3000";

export class OrgService {
    public static async getOrg(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getOrgMembers(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id + "/members", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getOrgSongs(id: number, page?: number, limit?: number) {
        let url = BASE_URL + "/api/orgs/" + id + "/songs"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }

        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getOrgSingles(id: number, page?: number, limit?: number) {
        let url = BASE_URL + "/api/orgs/" + id + "/singles"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async getOrgAlbums(id: number, page?: number, limit?: number) {
        let url = BASE_URL + "/api/orgs/" + id + "/albums"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async deleteOrg(id: number) {
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
        });
    }

    public static async editOrg(
        id: number,
        name: string,
        image: string | null
    ) {
        let body: { image?: string; name: string } = {
            name: name,
        };

        if (image) {
            body = {
                ...body,
                image: image
            };
        }
        return await fetch(BASE_URL + "/api/orgs/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string
            },
            body: JSON.stringify(body),
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
