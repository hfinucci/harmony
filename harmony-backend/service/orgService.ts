import {CreateOrgRequest} from "../models/createOrgRequest";
import {OrgPersistence} from '../persistence/orgPersistence';
import {UpdateOrgRequest} from "../models/updateOrgRequest";

export class OrgService {

    public static async createOrg(request: CreateOrgRequest) {
        return await OrgPersistence.createOrg(request);
    }

    public static async updateOrg(id: number, request: UpdateOrgRequest) {
        const storedOrg = await this.getOrgById(id)
        const updatedOrg = {...storedOrg, ...request}
        return await OrgPersistence.updateOrg(updatedOrg);
    }

    public static async getOrgById(id: number) {
        return await OrgPersistence.getOrgById(id);
    }

    static async deleteOrgById(id: number) {
        return await OrgPersistence.deleteOrgById(id);
    }
}