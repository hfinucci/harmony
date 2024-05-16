import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../../components/SongCard/SongCard";
import { OrgService } from "../../service/orgService";
import { FaMusic } from "react-icons/fa";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import AddMemberModal from "../../components/AddMemberModal/AddMemberModal";

import DeleteOrgModal from "../../components/DeleteOrgModal/DeleteOrgModal";
import EditOrgModal from "../../components/EditOrgModal/EditOrgModal";
import { useTranslation } from "react-i18next";
import { Song } from "../SongsPage/SongsPage.tsx";
import { Org } from "../../types/dtos/Org.ts";
import { ORG_IMAGE_DEFAULT } from "../../utils.ts";

const OrgPage = () => {
    const [org, setOrg]: any = useState();
    const [members, setMembers]: any = useState();
    const [songs, setSongs] = useState<Song[]>([]);
    const [image, setImage] = useState(ORG_IMAGE_DEFAULT);

    const orgId = useParams();

    const { t } = useTranslation();

    useEffect(() => {
        OrgService.getOrg(Number(orgId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                setOrg(info);
                setImage(info.image);
            }
        });
    }, []);

    useEffect(() => {
        OrgService.getOrgMembers(Number(orgId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                setMembers(info);
            }
        });
    }, [org]);

    const fetchSongs = async () => {
        await OrgService.getOrgSongs(Number(orgId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                setSongs(info);
            }
        });
    };

    useEffect(() => {
        const fetch = async () => {
            await fetchSongs();
        };
        fetch();
    }, [org]);

    const addSong = (song: any) => {
        if (songs) {
            setSongs([...songs, song]);
        } else {
            setSongs([song]);
        }
    };

    const editOrg = (org: Org) => {
        setOrg(org);
    };

    return (
        <div>
            <div className="absolute z-1 bg-gradient-to-t from-black w-full h-96 bg-cover bg-center" />
            <header
                className={
                    "w-full -mt-24 h-96 bg-[url('" +
                    image +
                    "')] bg-cover bg-center flex justify-start items-end"
                }
            >
                {org && (
                    <div className="flex w-full z-10 justify-between">
                        <h1 className="m-5 text-center text-5xl text-white drop-shadow-lg">
                            {org.name}
                        </h1>
                        <div className="flex gap-2 items-center mr-5">
                            <DeleteOrgModal id={org.id} />
                            <EditOrgModal org={org} callback={editOrg} />
                        </div>
                    </div>
                )}
            </header>
            <div className="flex flex-row gap-4 my-10 justify-items-stretch ">
                <div className="basis-1/2 flex flex-col grow gap-2 ml-10">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <FaMusic className="text-2xl text-fuchsia-950" />
                            <h1 className="text-2xl text-fuchsia-950 font-semibold">
                                {t("pages.org.songs.title")}
                            </h1>
                        </div>
                        <CreateSongModal org={orgId.id} callback={addSong} />
                    </div>
                    {songs.length !== 0 ? (
                        <div className=" flex flex-col rounded-lg bg-white p-10">
                            <table className="table table-bordered border-separate border-spacing-y-1.5">
                                <thead>
                                    <tr>
                                        <th
                                            className={
                                                "text-left text-gray-500"
                                            }
                                        >
                                            {t("pages.org.songs.name")}
                                        </th>
                                        <th
                                            className={
                                                "text-left text-gray-500"
                                            }
                                        >
                                            {t("pages.org.songs.creationDate")}
                                        </th>
                                        <th
                                            className={
                                                "text-left text-gray-500"
                                            }
                                        >
                                            {t("pages.org.songs.lastModified")}
                                        </th>
                                        <th
                                            className={
                                                "text-left text-gray-500"
                                            }
                                        >
                                            {t("pages.org.songs.actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {songs.map((elem: Song, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    style={{
                                                        backgroundColor:
                                                            "#f0f0f0",
                                                    }}
                                                />
                                            </tr>
                                            <SongCard
                                                song={
                                                    {
                                                        name: elem.name,
                                                        id: elem.id,
                                                        created: elem.created,
                                                        lastmodified:
                                                            elem.lastmodified,
                                                    } as Song
                                                }
                                                fetchSongs={fetchSongs}
                                            />
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        songs.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.org.songs.none")}
                                </h1>
                            </div>
                        )
                    )}
                </div>
                <div className="flex flex-col shrink gap-2 mr-10 w-fit">
                    <h1 className="text-2xl text-fuchsia-950 font-semibold">
                        {t("pages.org.members")}
                    </h1>
                    <div className=" flex flex-col grow rounded-lg bg-white p-5 justify-between">
                        {members && (
                            <table className="table table-bordered border-separate border-spacing-y-1.5">
                                <tbody>
                                    {members.map((elem: any, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>{elem.name}</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    style={{
                                                        backgroundColor:
                                                            "#f0f0f0",
                                                    }}
                                                />
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <AddMemberModal org={orgId.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgPage;
