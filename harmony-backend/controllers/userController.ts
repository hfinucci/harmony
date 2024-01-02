import {FastifyInstance, FastifyRequest} from 'fastify'
import server, {logger} from "../server";
import {UserPersistence} from '../persistence/userPersistence';
import {AuthService} from '../service/authService';
import {UserService} from '../service/userService';
import {parseCreateUserRequest} from '../models/createUserRequest';
import {parseChangeIconRequest} from '../models/changeIconRequest';
import {handleError, parseId} from '../utils';

const BASE_URL = '/api/user'

export default async function userController(fastify: FastifyInstance, opts: any) {

    server.get(BASE_URL + '/:id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Getting user with id: " + id);
            return await UserPersistence.getUserWithID(id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
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
            return await UserService.createUser(request.email, request.name, data.user.id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
        
    });

    server.delete(BASE_URL + '/:id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        try{
            parseId(id)
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
            return await UserService.deleteUser(id);
        } catch (err) {
            logger.info(err);
            return handleError(err, rep)
        }
    })

    server.put(BASE_URL + '/:id', async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        try {
            const id = req.params.id
            parseId(id)
            const request = parseChangeIconRequest(req.body)
            logger.info("Changing image for user with id " + id)
            return await UserService.changeIcon(id, request)
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    })

    server.get(BASE_URL + '/:id' + "/songs", async (req: FastifyRequest<{Params: {id: number}}> , rep) => {
        const id = req.params.id;
        try {
            parseId(id)
            logger.info("Getting songs with id: " + id);
            return await UserPersistence.getUserWithID(id);
        } catch (error: any) {
            logger.error(error)
            return handleError(error, rep)
        }
    });
}