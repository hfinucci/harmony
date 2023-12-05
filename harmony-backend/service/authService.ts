import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { logger } from '../server'

const supabase = createClient("http://localhost:54321", process.env.AUTH_KEY || "")

export class AuthService {

    public static async signUpNewUser(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: "Hernan Finucci"
                }
            }
        })
        console.log(error)
        return data
    }
}