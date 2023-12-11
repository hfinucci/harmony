import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import server, { logger } from "../server";
import { AuthService } from '../service/authService';
import { UserService } from '../service/userService';


//TODO: Ya se que asi no se deberia hacer pero es un fix del momento
const BASE_URL = '/api/auth/'

export default async function authController(fastify: FastifyInstance, opts: any) {

    server.post(BASE_URL, async (req: FastifyRequest<{Body: {email: string, password: string}}> , rep) => {
        const email = req.body.email;
        const password = req.body.password;
        logger.info("Signing in user with email: " + email);
        const data = await AuthService.signInWithPassword(email, password);
        if(data.user?.id == undefined)
            return false;
        return true;
    });

    server.get(BASE_URL, async (req: FastifyRequest<{}> , rep) => {
        const auth_data = await AuthService.getLoggedUser();
        let data = null
        if(auth_data != undefined && auth_data.user != null ) {
            data = UserService.getUser(auth_data.user?.id)
        }
        return data
    });

    server.put(BASE_URL, async (req: FastifyRequest<{Body: {new_password: string}}> , rep) => {
        const new_pass = req.body.new_password
        AuthService.updatePassword(new_pass)
    })

}