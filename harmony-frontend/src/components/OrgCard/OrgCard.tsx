import { useEffect, useState } from "react";
import { OrgService } from "../../service/orgService";
import "./OrgCard.css";
import { useTranslation } from "react-i18next";
import ORG_IMAGE_DEFAULT from "../../assets/org-default-image.jpg";
import { Org } from "../../types/dtos/Org";
import {Link} from "react-router-dom";
import {ImageService} from "../../service/imageService.ts";
import {BASE64_HEADER, IMAGE_TYPE} from "../../utils.ts";

const OrgCard = (org: Org) => {
    const [members, setMembers] = useState<string>();
    const [image, setImage] = useState<string>(ORG_IMAGE_DEFAULT);

    const { t } = useTranslation();

    useEffect(() => {
        OrgService.getOrgMembers(org.id).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                let members = "";
                info.forEach((member: any) => {
                    members += member.name;
                    if (info.indexOf(member) != info.length - 1)
                        members += ", ";
                });
                setMembers(members);
            }
        });
    }, []);

    useEffect(() => {
        ImageService.getImage(org.id, IMAGE_TYPE.ORG).then(async (rsp) => {
            if (rsp?.status == 200) {
                const img = await rsp.json();
                setImage(BASE64_HEADER + img.image);
            }
        });
    }, [org.id]);

    return (
        <Link
            to={`/orgs/${org.id}`}
            className="width flex flex-col justify-between bg-white border border-2 border-white hover:border-gray-200 rounded-lg shadow"
        >
            <div className="max-h-52 flex justify-center">
                <img
                    className="h-full object-contain rounded-t-lg justify-center"
                    src={image}
                    onError={() => {
                        setImage(ORG_IMAGE_DEFAULT);
                    }}
                    alt="org image"
                />
            </div>
            <div className="pt-5 pr-5 pl-5">
                <h5 className="mb-2 text-2xl font-extralight tracking-tight text-gray-400">
                    {org.name}
                </h5>
                {members && (
                    <p className="mb-3 font-normal text-fuchsia-950">
                        {t("components.orgCard.members")}
                        {members}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default OrgCard;
