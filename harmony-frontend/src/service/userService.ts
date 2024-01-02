// const BASE_URL = process.env.REACT_APP_API_ENDPOINT || ''
import {Song} from "../pages/SongsPage/SongsPage.tsx";

const BASE_URL = "http://127.0.0.1:3000";

export class UserService {
    public static async getUserInfo(userId: number) {
        return await fetch(BASE_URL + "/api/user/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public static async getLoggedUser() {
        return await fetch(BASE_URL + "/api/auth/", {
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
        return await fetch(BASE_URL + "/api/user", {
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
        return await fetch(BASE_URL + "/api/auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }).then((response) => {
            return response;
        });
    }

    public static async changePassword(password: string) {
        return await fetch(BASE_URL + "/api/auth/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
            }),
        });
    }

    public static async getSongsByUserId(userId: number): Promise<Song[]> {
        const response = await fetch(BASE_URL + "/api/user/" + userId + "/songs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json()
    }
}
