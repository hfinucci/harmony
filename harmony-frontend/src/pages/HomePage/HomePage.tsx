import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";
import { FaMusic, FaPeopleGroup } from "react-icons/fa6";
import { RiAlbumFill } from "react-icons/ri";
import {OrgPagination} from "../../types/dtos/Org";
import {Song, SongPagination} from "../../types/dtos/Song";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import React from "react";
import SongCard from "../../components/SongCard/SongCard";
import OrgCard from "../../components/OrgCard/OrgCard";
import { useNavigate } from "react-router-dom";

import {AlbumPagination} from "../../types/dtos/Album";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import CreateAlbumModal from "../../components/CreateAlbumModal/CreateAlbumModal";

const HomePage = () => {
    const [orgs, setOrgs] = useState<OrgPagination>();
    const [songs, setSongs] = useState<SongPagination>();
    const [albums, setAlbums] = useState<AlbumPagination>();


    const { t } = useTranslation();
    const nav = useNavigate();

    const addSong = (song: Song) => {
        nav("/songs/" + song.id)
    };

    const fetchSongs = async () => {
        await UserService.getSongsByUserId(
            Number(localStorage.getItem("harmony-uid")),
            1,
            5
        ).then((response) => {
            setSongs(response);
        });
    };

    const fetchAlbums = async () => {
        await UserService.getUserAlbums(localStorage.getItem("harmony-uid"), 1, 3)
            .then(async (rsp) => {
                const a = await rsp.json() as AlbumPagination
                setAlbums(a)
            })
    }

    useEffect(() => {
        const userId = localStorage.getItem("harmony-uid") as string;
        UserService.getUserOrgs(userId, 1, 3).then((res) => {
            if (res?.status == 200) {
                res.json().then((data: OrgPagination) => {
                    setOrgs(data);
                });
            }
        });
        fetchSongs();
        fetchAlbums();
    }, []);

    return (
        <div className="container h-screen mx-auto flex flex-col">
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row gap-2">
                        <FaPeopleGroup />
                        {t("pages.home.myOrgs")}
                    </h1>
                    <CreateOrgModal />
                </div>

                {orgs && orgs.orgs.length != 0 ? (
                    <div className="flex flex-row gap-5 justify-start content-center rounded-lg p-5">
                        {orgs.orgs.map((org, index) => (
                                <OrgCard
                                    key={index}
                                    name={org.name}
                                    id={org.id}
                                />
                        ))}
                        {orgs.totalItems > 3 && (
                            <button
                                onClick={() => nav("/orgs")}
                                aria-label="see more orgs"
                                type="button"
                                className="bg-white flex w-fit h-fit items-center self-center text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
                            >
                                {t("pages.home.more")}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-4 md:p-5">
                        <h1 className="text-2xl text-fuchsia-950">
                            {t("pages.home.noOrgs")}
                        </h1>
                    </div>
                )}
            </div>
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row gap-2">
                        <RiAlbumFill />
                        {t("pages.home.myAlbums")}
                    </h1>
                    <CreateAlbumModal callback={(album) => nav("/albums/" + album.id)}/>
                </div>

                {albums && albums.albums.length != 0 ? (
                    <div className="flex flex-row gap-5 justify-start content-center rounded-lg p-5">
                        {albums.albums.map((album, index) => (
                            <AlbumCard
                                key={index}
                                name={album.name}
                                id={album.id}
                                org={album.org}
                            />
                        ))}
                        {albums.totalItems > 3 && (
                            <button
                                onClick={() => nav("/albums")}
                                aria-label="see more albums"
                                type="button"
                                className="bg-white flex w-fit h-fit items-center self-center text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
                            >
                                {t("pages.home.more")}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-4 md:p-5">
                        <h1 className="text-2xl text-fuchsia-950">
                            {t("pages.home.noAlbums")}
                        </h1>
                    </div>
                )}
            </div>
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row gap-2">
                        <FaMusic />
                        {t("pages.home.recentSongs")}
                    </h1>
                    <CreateSongModal callback={addSong} />
                </div>

                <div className="flex flex-col rounded-lg bg-white p-10">
                    {songs && songs.songs.length !== 0 ? (
                        <table className="table table-bordered border-separate border-spacing-y-1.5">
                            <thead>
                                <tr className="grid grid-cols-5 w-full">
                                    <th className={"text-left text-gray-500"}>
                                        {t("pages.home.song.name")}
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        {t("pages.home.song.org")}
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        {t("pages.home.song.creationDate")}
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        {t("pages.home.song.lastModified")}
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        {t("pages.home.song.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {songs
                                    .songs
                                    .map((elem: Song, index: number) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    style={{
                                                        backgroundColor:
                                                            "#f0f0f0",
                                                    }}
                                                    key={index}
                                                />
                                            </tr>
                                            <SongCard
                                                song={elem}
                                                fetchSongs={fetchSongs}
                                            />
                                        </React.Fragment>
                                    ))}
                                {songs.totalItems > 5 && (
                                    <button
                                        onClick={() => nav("/songs")}
                                        aria-label="see more songs"
                                        type="button"
                                        className="bg-white flex w-fit h-fit items-center text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
                                    >
                                        {t("pages.home.more")}
                                    </button>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        songs && songs.songs.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.home.noSongs")}
                                </h1>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
