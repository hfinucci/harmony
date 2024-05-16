import {MemberPersistence} from '../persistence/memberPersistence';

export class MemberService {

    public static async createMember(user: number, org: number) {
        return await MemberPersistence.createMembership(user, org);
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

    static async deleteMemberById(user: number, org: number) {
        return await MemberPersistence.deleteMembership(user, org);
    }
}