import React, { useEffect, useState } from "react";
import { UserService } from "../../service/userService.ts";
import OrgCard from "../../components/OrgCard/OrgCard";
import { IoPeopleSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";
import {Org, OrgPagination} from "../../types/dtos/Org.ts";
import Pagination from "../../components/Pagination/Pagination";

const OrgsPage = () => {
    const [orgs, setOrgs] = useState<OrgPagination>();
    const [page, setPage] = useState<number>(1);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            setOrgs(null)
            const userId = localStorage.getItem("harmony-uid") as string;
            const response = await UserService.getUserOrgs(userId, page, 9);
            const orgs = (await response.json()) as OrgPagination;
            setOrgs(orgs);
        })();
    }, [page]);

    return (
        <div className="container h-screen mt-8 mx-auto max-w-12xl">
            <div className="flex flex-row justify-between items-center">
                <div className="text-fuchsia-950 text-4xl mb-4 flex flex-row gap-3 items-center">
                    <IoPeopleSharp />
                    <h1>{t("pages.orgs.title")}</h1>
                </div>
                <CreateOrgModal />
            </div>
            {orgs && orgs.orgs.length > 0 && (
                <>
                    <div data-testid={"orgs-page-orgs"} className="flex flex-row flex-wrap gap-5 justify-start rounded-lg p-5">
                        {orgs.orgs.map((elem: Org) => (
                            <OrgCard
                                key={elem.id}
                                name={elem.name}
                                id={elem.id}
                            />
                        ))}
                    </div>
                    {orgs.totalPages > 1 &&
                        <Pagination page={orgs.page} totalPages={orgs.totalPages} onPageChange={handlePageChange}/>
                    }
                </>
            )}
            {orgs && orgs.orgs.length == 0 && (
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
