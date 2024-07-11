import {logger} from "../server";
import {MemberService} from "../service/memberService";
import {AlbumService} from "../service/albumService";

export const checkIfRequesterIsMember = async (userId: number, orgId: number) => {
    logger.info("Checking if user is member of org with id: " + orgId);
    await MemberService.getMembership(
        userId,
        orgId
    );
}

export const checkIfAlbumIsFromOrg = async (albumId: number, orgId: number) => {
    logger.info("Checking if album with id " + albumId + " is from org with id: " + orgId);
    const album = await AlbumService.getAlbumById(albumId);
    if(orgId != album.org)
        throw new Error("Album with id " + albumId + " is not from organization with id " + orgId)
}