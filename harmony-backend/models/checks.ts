import {logger} from "../server";
import {MemberService} from "../service/memberService";

export const checkIfRequesterIsMember = async (userId: number, orgId: number) => {
    logger.info("Checking if user is member of org with id: " + orgId);
    await MemberService.getMembership(
        userId,
        orgId
    );
}