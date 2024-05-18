import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";
import { FaMusic, FaPeopleGroup } from "react-icons/fa6";
import { Org } from "../../types/dtos/Org";
import { Song } from "../SongsPage/SongsPage";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import React from "react";
import SongCard from "../../components/SongCard/SongCard";
import OrgCard from "../../components/OrgCard/OrgCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    const { t } = useTranslation();
    const nav = useNavigate();

    const addSong = (song: Song) => {
        if (songs) {
            setSongs([...songs, song]);
        } else {
            setSongs([song]);
        }
    };

    const fetchSongs = async () => {
        await UserService.getSongsByUserId(
            Number(localStorage.getItem("harmony-uid"))
        ).then((response: Song[]) => {
            setSongs(response);
        });
    };

    useEffect(() => {
        const userId = localStorage.getItem("harmony-uid") as string;
        UserService.getUserOrgs(userId).then((res) => {
            if (res?.status == 200) {
                res.json().then((data) => {
                    setOrgs(data);
                });
            }
        });
        fetchSongs();
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

                {orgs.length != 0 ? (
                    <div className="flex flex-row gap-5 justify-start content-center w-fit rounded-lg p-5">
                        {orgs.slice(0, 3).map((org, index) => (
                                <OrgCard
                                    key={index}
                                    name={org.name}
                                    image={org.image}
                                    id={org.id}
                                />
                        ))}
                        {orgs.length > 3 && (
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
                        <FaMusic />
                        {t("pages.home.recentSongs")}
                    </h1>
                    <CreateSongModal callback={addSong} />
                </div>

                <div className="flex flex-col rounded-lg bg-white p-10">
                    {songs.length !== 0 ? (
                        <table className="table table-bordered border-separate border-spacing-y-1.5">
                            <thead>
                                <tr>
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
                                    .slice(0, 5)
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
                                {songs.length > 5 && (
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
                        songs.length == 0 && (
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
