import React, { useEffect, useState } from "react";
import { UserService } from "../../service/userService.ts";
import OrgCard from "../../components/OrgCard/OrgCard";
import { IoPeopleSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";
import { Org } from "../../types/dtos/Org.ts";

const OrgsPage = () => {
    const [orgs, setOrgs] = useState<Org[]>();

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const userId = localStorage.getItem("harmony-uid") as string;
            const response = await UserService.getUserOrgs(userId);
            const orgs = (await response.json()) as Org[];
            setOrgs(orgs);
        })();
    }, []);

    return (
        <div className="container h-screen mt-8 mx-auto max-w-12xl">
            <div className="flex flex-row justify-between items-center">
                <div className="text-fuchsia-950 text-4xl mb-4 flex flex-row gap-3 items-center">
                    <IoPeopleSharp />
                    <h1>{t("pages.orgs.title")}</h1>
                </div>
                <CreateOrgModal />
            </div>
            {orgs && orgs.length > 0 && (
                <div data-testid={"orgs-page-orgs"} className="flex flex-row flex-wrap gap-5 justify-start w-fit rounded-lg p-5">
                    {orgs.map((elem: Org, index: number) => (
                        <OrgCard
                            key={index}
                            name={elem.name}
                            image={elem.image}
                            id={elem.id}
                        />
                    ))}
                </div>
            )}
            {orgs && orgs.length == 0 && (
                <div className="flex items-center justify-center p-4 md:p-5">
                    <h1 className="text-2xl text-fuchsia-950">
                        {t("pages.orgs.noOrgs")}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default OrgsPage;
