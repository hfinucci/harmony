import {MemberPersistence} from '../persistence/memberPersistence';
import {MailService} from "./mailService";

export class MemberService {

    public static async createMember(user: number, org: number) {
        const newMember = await MemberPersistence.createMembership(user, org);
        const orgMembers = await MemberPersistence.getMembersByOrg(org);
        // make a new array with the mails of the members of the org except the newMember
        const membersMails = orgMembers
            .filter((member) => member.id !== user)
            .map((member) => member.email);

        await MailService.sendNewMemberJoinedMail(membersMails, org);

        return newMember;
    }

    public static async getMembersByOrg(org: number) {
        return await MemberPersistence.getMembersByOrg(org);
    }

    public static async getOrgsByUser(user: number) {
        return (await MemberPersistence.getOrgsByUser(user)).map(
            (org) =>
                ({
                ...org,
                image: "http://localhost:54321/storage/v1/object/public/orgs_images/" + org.id + "/profile.png"
            })
        );
    }

    public static async getMembership(user: number, org: number) {
        return await MemberPersistence.getMembership(user, org);
    }

    static async deleteMemberById(user: number, org: number) {
        return await MemberPersistence.deleteMembership(user, org);
    }
}