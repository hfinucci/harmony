import {useEffect, useState} from "react";
import {OrgService} from "../../service/orgService";
import "./OrgCard.css"
import { useTranslation } from "react-i18next";
import image from "../../assets/org-default-image.jpg"

export interface Org {
    name: string;
    image: string;
    id: number;
}

const OrgCard = (
    org: Org
) => {
    const [members, setMembers] = useState<string>()

    const { t } = useTranslation();

    useEffect(() => {
        OrgService.getOrgMembers(org.id).then(async (rsp) => {
            if(rsp?.status == 200){
                const info = await rsp.json()
                let members = "";
                info.forEach((member: any) => {
                    members += member.name
                    if(info.indexOf(member) != info.length - 1)
                        members +=", "
                })
                setMembers(members)
            }
        })
    }, [])
    return (
        <a href={`/orgs/${org.id}`} className="width flex flex-col justify-between bg-white border border-2 border-white hover:border-gray-200 rounded-lg shadow">
            <div className="max-h-52 flex justify-center">
                {org.image &&
                    <img className="h-full object-contain rounded-t-lg justify-center" src={org.image} alt="org image"/>
                }
                {!org.image &&
                    <img className="h-full object-contain rounded-t-lg justify-center" src={image} alt="org image"/>
                }

            </div>
            <div className="pt-5 pr-5 pl-5">
                <h5 className="mb-2 text-2xl font-extralight tracking-tight text-gray-400">
                    {org.name}
                </h5>
                {members &&
                    <p className="mb-3 font-normal text-fuchsia-950">
                        {t("components.orgCard.members")}{members}
                    </p>
                }
            </div>
        </a>
    )
}

export default OrgCard;