

// const BASE_URL = process.env.REACT_APP_API_ENDPOINT || ''
const BASE_URL = "http://127.0.0.1:3000"

export class UserService {

    public static async getUserInfo(userId: number) {
        const response = await fetch(BASE_URL + '/api/user/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    }
    
    public static async getLoggedUser() {
        const response = await fetch(BASE_URL + '/api/auth/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        return data
    }

    public static async signUpWithUserAndPassword(name: string, email: string, password: string) {
        const response = await fetch(BASE_URL + '/api/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name
            })
        })
        return response
    }  
    
    public static async signInWithUserAndPassword(email: string, password: string) {
        return await fetch(BASE_URL + '/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => {
            return response.text()
        })
    }
}