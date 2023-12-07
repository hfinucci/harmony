import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { UserPersistence } from '../persistence/userPersistence';
import { AuthService } from '../service/authService';
import { UserService } from '../service/userService';

const BASE_URL = '/api/user/'

export default async function userController(fastify: FastifyInstance, opts: any) {
    
    server.get(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        logger.info("Getting user with id: " + id);
        return {name:await UserPersistence.getUserName(id)};
    });

    server.post(BASE_URL, async (req: FastifyRequest<{Body: {email: string, password: string, name: string}}> , rep) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name
        logger.info("Signing up user with email: " + email);
        const data = await AuthService.signUpNewUser(email, password);
        if(data.user?.id == undefined)
            return false;
        const rsp = await UserService.createUser(email, name, data.user.id);
        return rsp != undefined;
    });

    server.delete(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        const auth_id = await UserPersistence.getAuthId(id);
        if (auth_id == null)
            logger.info("User with id " + id + " does not exists, so it can't be deleted")
        else 
            await AuthService.deleteUser(auth_id);
        const deleted = await UserService.deleteUser(id);
        return deleted != null;
    })

    //TODO: Esta funcion funciona para los usarios que estan loggeados, asi que ni la probe...
    server.put(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}, Body: {password: string}}> , rep) => {
        const id = req.params.id;
        const password = req.body.password
        AuthService.updatePassword(password)
    })
}