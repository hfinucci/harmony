import {ChangeIconRequest} from "../models/changeIconRequest";
import {UserPersistence} from "../persistence/userPersistence";
import {logger} from '../server'
import {AuthService} from "./authService";
import {CreateUserRequest} from "../models/createUserRequest";

export class UserService {

    public static async createUser(request: CreateUserRequest) {
        const hashedPassword = await AuthService.generateHashedPassword(request.password)
        const created = await UserPersistence.createUser(request.email, request.name, hashedPassword);
        if (!created)
            throw new Error("Error creating user")
        return created
    }

    public static async getUserById(id: number) {
        return await UserPersistence.getUserById(id);
    }

    public static async deleteUserById(id: number) {
        logger.info("Deleting user with id " + id + " from user table")
        const deleted = await UserPersistence.deleteUserById(id);
        if(!deleted)
            throw new Error("Deletion of user with ID " + id + " failed")
        return deleted
    }

    public static async changeIcon(id: number, request: ChangeIconRequest) {
        const changed = await UserPersistence.changeImg(id, request.image)
        if(!changed)
            throw new Error("Icon couldn't be changed")
        return changed
    }

    public static async getUser(auth_id: string) {
        logger.info("Getting user with auth_id " + auth_id);
        const user = await UserPersistence.getUserWithAuthId(auth_id)
        if(user == null)
            throw new Error("Didn't find user with auth ID " + auth_id)
        return user;
    }

    public static async getAuthId(id: number) {
        logger.info("Getting the auth ID for user with ID " + id);
        const auth_id = await UserPersistence.getAuthId(id)
        if(auth_id == null) {
            throw new Error("User with ID " + id + " dosen't have an auth ID associated, probably the user dosen't exist")
        }
        return auth_id;
    }
}