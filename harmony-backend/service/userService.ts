import { UserPersistence } from "../persistence/userPersistence";
import { logger } from '../server'

export class UserService {

    public static async createUser(email: string, name: string, auth_id: string) {
        const creted = await UserPersistence.createUser(email, name, auth_id);
        return creted
    }

    public static async deleteUser(id:number) {
        logger.info("Deleting user with id " + id + " from auth table")
        const deleted = await UserPersistence.deleteUser(id);
        return deleted
    }

    public static async changeIcon(id: number) {
        //TODO: ver como manejar lo de la imagen
    }
}