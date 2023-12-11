import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { logger } from '../server'

const supabase = createClient("http://localhost:54321", process.env.AUTH_KEY || "")

export class AuthService {

    public static async signUpNewUser(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error != undefined)
            logger.info("Sign up failed with message: " + error)
        return data
    }

    public static async deleteUser(id:string) {
        logger.info("Deleting user with id " + id + " from auth table")
        const { data, error } = await supabase.auth.admin.deleteUser(id)
        if (error != undefined)
            logger.info("Delete failed with message: " + error)
        return data
    }

    //TODO: Esta funcion funciona para los usarios que estan loggeados, asi que ni la probe...
    public static async updatePassword(password: string) {
        const { data, error } = await supabase.auth.updateUser({ password: password })
        if (error != undefined)
            logger.info("Password update failed with message: " + error)
        return data
    }

    public static async signInWithPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error != null) {
            logger.info("Log in failed with message: " + error.message)
        }
        return data
    }

    public static async getLoggedUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error != undefined)
            logger.info("Get logged user failed with message: " + error.message)
        return data
    }


}