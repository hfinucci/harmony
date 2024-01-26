import { useEffect, useState } from "react";
import { UserService } from "../../service/userService";
import { FaMusic, FaPeopleGroup } from "react-icons/fa6";
import { Organization } from "../../types/dtos/Organization";
import { Song } from "../SongsPage/SongsPage";
import { useTranslation } from "react-i18next";
import CreateOrgModal from "../../components/CreateOrgModal/CreateOrgModal";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import React from "react";
import SongCard from "../../components/SongCard/SongCard";

const HomePage = () => {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    const { t } = useTranslation();

    // TODO: Add org card when finished

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
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row">
                        <FaPeopleGroup />
                        {t("pages.home.myOrgs")}
                    </h1>
                    <CreateOrgModal />
                </div>

                <div className="flex flex-col rounded-lg bg-white p-10">
                    {orgs.length != 0 ? (
                        orgs.map((org) => <p>Organization name: {org.name}</p>)
                    ) : (
                        <p>No tienes organizaciones</p>
                    )}
                </div>
            </div>
            <div className="my-4">
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-fuchsia-950 text-4xl flex flex-row">
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
                                        Nombre
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        Organización
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        Fecha de Creación
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        Fecha de Modificación
                                    </th>
                                    <th className={"text-left text-gray-500"}>
                                        Acciones
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
                                                    backgroundColor: "#f0f0f0",
                                                }}
                                            />
                                        </tr>
                                        <SongCard
                                            song={elem}
                                            fetchSongs={fetchSongs}
                                        />
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        songs.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    Oops! No tenes canciones
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
