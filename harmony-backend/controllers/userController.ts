import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { UserPersistence } from '../persistence/userPersistence';
import { AuthService } from '../service/authService';
import { UserService } from '../service/userService';
import { parseCreateUserRequest } from '../models/createUserRequest';
import {z} from "zod";
import { parseChangeIconRequest } from '../models/changeIconRequest';

const BASE_URL = '/api/user'

export default async function userController(fastify: FastifyInstance, opts: any) {
    
    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        logger.info("Getting user with id: " + id);
        return {name:await UserPersistence.getUserName(id)};
    });

    server.post(BASE_URL, async (req, rep) => {
        try {
            const request = parseCreateUserRequest(req.body)
            logger.info("Signing up user with email: " + request.email);
            const data = await AuthService.signUpNewUser(request);
            if(data.user?.id == undefined){ 
                //Creo que aca no entra nunca, porque catchea el error que tiro desde la función
                return rep
                    .code(409)
                    .send()
            }
            const rsp = await UserService.createUser(request.email, request.name, data.user.id);
            return rsp;
        } catch (error: any) {
            logger.error(error)
            if (error instanceof z.ZodError) {
                return rep
                    .code(400)
                    .send()
            } else {
                return rep
                    .code(409)
                    .send()
            }
        };
        
    });

    server.delete(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        try{
            const auth_id = await UserService.getAuthId(id);
            if (auth_id == null){
                //Creo que no entra aca porque catchea el error que tiro en el userService
                logger.info("User with ID " + id + " does not exists, so it can't be deleted")
                return rep
                    .code(404)
                    .send()
            }
            else 
                await AuthService.deleteUser(auth_id);
            const deleted = await UserService.deleteUser(id);
            return deleted;
        } catch (err) {
            logger.info(err);
            return rep
                .code(404)
                .send();
        }
    })

    server.put(BASE_URL + ':id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        try {
            const request = parseChangeIconRequest(req.body)
            logger.info("Changing image for user with id " + req.params.id)
            const changed = await UserService.changeIcon(req.params.id, request)
            return changed != null
        } catch (err) {
            logger.error(err)
            if (err instanceof z.ZodError) {
                return rep
                    .code(400)
                    .send()
            } else {
                return rep
                    .code(409)
                    .send()
            }
        }
        
    })
}