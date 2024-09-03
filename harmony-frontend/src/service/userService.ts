

// const BASE_URL = process.env.REACT_APP_API_ENDPOINT || ''


import {SongPagination} from "../types/dtos/Song";

const BASE_URL = "http://127.0.0.1:3000";

export class UserService {
    public static async getUserInfo(userId: number) {
        return await fetch(BASE_URL + "/api/users/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getLoggedUser() {
        return await fetch(BASE_URL + "/api/auth", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async signUpWithUserAndPassword(
        name: string,
        email: string,
        password: string
    ) {
        return await fetch(BASE_URL + "/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name,
            }),
        });
    }

    public static async signInWithUserAndPassword(
        email: string,
        password: string
    ) {
        return await fetch(BASE_URL + "/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
    }

    public static async changePassword(password: string) {
        return await fetch(BASE_URL + "/api/auth", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
            }),
        });
    }

    public static async changeProfileImage(userId: number, image: string) {
        return await fetch(BASE_URL + "/api/users/" + userId , {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string,
            },
            body: JSON.stringify({
                image: image,
            }),
        });
    }

    public static async deleteAccount() {
        return await fetch(BASE_URL + "/api/users", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string,
            },
        });
    }

    public static async getSongsByUserId(userId: number, page?: number, limit?: number): Promise<SongPagination> {
        let url = BASE_URL + "/api/users/" + userId + "/songs"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }
        const response = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("harmony-jwt") as string,
                },
            }
        );
        return await response.json();
    }

    public static async getUserOrgs(userId: string, page?: number, limit?: number) {
        let url = BASE_URL + "/api/users/" + userId + "/orgs"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: ("Bearer " +
                    localStorage.getItem("harmony-jwt")) as string,
            },
        });
    }

    public static async getUserAlbums(userId: string, page?: number, limit?: number) {
        let url = BASE_URL + "/api/users/" + userId + "/albums"
        if (page) {
            url += "?page=" + page
            if (limit)
                url += "&limit=" + limit
        }
        return await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: ("Bearer " +
                    localStorage.getItem("harmony-jwt")) as string,
            },
        });
    }
}
