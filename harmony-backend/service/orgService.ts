import {CreateOrgRequest} from "../models/createOrgRequest";
import {OrgPersistence} from '../persistence/orgPersistence';
import {UpdateOrgRequest} from "../models/updateOrgRequest";
import {ImageService} from "./imageService";

export class OrgService {

    public static async createOrg(request: CreateOrgRequest) {
        const org = await OrgPersistence.createOrg(request);
        if (request.image != null)
            await ImageService.uploadOrgImage(org.id, request.image);
        return org;
    }

    public static async updateOrg(id: number, request: UpdateOrgRequest) {
        const storedOrg = await this.getOrgById(id)
        const updatedOrg = {...storedOrg, ...request}
        if (request.image != null)
            await ImageService.uploadOrgImage(updatedOrg.id, request.image);
        return await OrgPersistence.updateOrg(updatedOrg);
    }

    public static async getOrgById(id: number) {
        return await OrgPersistence.getOrgById(id);
    }

    static async deleteOrgById(id: number) {
        return await OrgPersistence.deleteOrgById(id);
    }
}