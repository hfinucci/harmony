import {FastifyInstance} from 'fastify'
import server, {logger} from "../server";
import {SongService} from '../service/songService';
import {handleError} from "../utils";
import {AuthService} from "../service/authService";
import {AlbumService} from "../service/albumService";
import {OrgService} from "../service/orgService";
import {z} from "zod";

const BASE_URL = '/api/search'

export default async function searchController(fastify: FastifyInstance, opts: any) {

    const searchInputSchema = z.string().regex(/^[a-zA-Z0-9 ]*$/, {
        message: "Input can only contain letters, numbers, and blank spaces",
    });

    server.post(BASE_URL, async (req: any, rep) => {
        const input = req.body.query;
        try {
            searchInputSchema.parse(input);
            const user = AuthService.parseJWT(req.headers.authorization);
            const [songs, albums, organizations] = await Promise.all([
                SongService.searchSongs(input, user),
                AlbumService.searchAlbums(input, user),
                OrgService.searchOrgs(input, user)
            ]);
            return {songs, albums, organizations};
        } catch (err) {
            logger.error(err)
            return handleError(err, rep)
        }
    });
}
