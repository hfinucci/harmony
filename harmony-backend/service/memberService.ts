import {MemberPersistence} from '../persistence/memberPersistence';
import {MailService} from "./mailService";

export class MemberService {

    public static async createMember(user: number, org: number) {
        const newMember = await MemberPersistence.createMembership(user, org);
        const orgMembers = await MemberPersistence.getMembersByOrg(org);

        const membersMails = orgMembers
            .filter((member) => member.id !== user)
            .map((member) => member.email);
        if (membersMails.length > 0)
            await MailService.sendNewMemberJoinedMail(membersMails, org);

        return newMember;
    }

    public static async getMembersByOrg(org: number) {
        return await MemberPersistence.getMembersByOrg(org);
    }

    public static async getOrgsByUser(user: number, page: number, limit: number) {
        return  await MemberPersistence.getOrgsByUser(user, page, limit)
    }

    public static async getMembership(user: number, org: number) {
        return await MemberPersistence.getMembership(user, org);
    }

    static async deleteMemberById(user: number, org: number) {
        return await MemberPersistence.deleteMembership(user, org);
    }
}