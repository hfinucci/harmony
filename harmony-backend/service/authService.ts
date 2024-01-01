import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { logger } from '../server'
import { AuthUserRequest } from '../models/authUserRequest'
import { NewPasswordRequest } from '../models/newPasswordRequest'

const supabase = createClient("http://localhost:54321", process.env.AUTH_KEY || "")

export class AuthService {

    public static async signUpNewUser(request: AuthUserRequest) {
        const { data, error } = await supabase.auth.signUp({
            email: request.email,
            password: request.password,
        })
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    public static async deleteUser(id:string) {
        logger.info("Deleting user with id " + id + " from auth table")
        const { data, error } = await supabase.auth.admin.deleteUser(id)
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    //TODO: mejorar el catcheo de error -> no pude hacer lo que queria
    public static async updatePassword(request: NewPasswordRequest) {
        const { data, error } = await supabase.auth.updateUser({ password: request.password })
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    public static async signInWithPassword(request: AuthUserRequest) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: request.email,
            password: request.password,
        })
        if (error != null) {
            throw new Error(error.message)
        }
        return data
    }

    public static async getLoggedUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error != undefined) {
            throw new Error(error.message)
        }
        return data
    }

    public static async signOutUser() {
        const { error } = await supabase.auth.signOut()
        if (error != null)
            throw new Error(error.message)
    }


}