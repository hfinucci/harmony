import React, {useEffect, useState} from "react";
import SongCard from "../../components/SongCard/SongCard.tsx";
import {UserService} from "../../service/userService.ts";
import {useTranslation} from "react-i18next";
import { FaMusic } from "react-icons/fa6";
import {Song, SongPagination} from "../../types/dtos/Song";

const SongsPage = () => {

    const [songs, setSongs] = useState<SongPagination>();

    const { t } = useTranslation();

    const fetchSongs = async () => {
        await UserService.getSongsByUserId(Number(localStorage.getItem('harmony-uid')))
            .then((response) => {
                setSongs(response);
            })
    }

    useEffect(() => {
        const fetch = async () => {
            await fetchSongs();
        }
        fetch();
    }, []);

    return (

        <div className="container h-screen mt-16 mx-auto max-w-12xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4 flex flex-row gap-2 items-center">
                <FaMusic />
                {t("pages.songs.title")}
            </h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
                {songs && songs.songs.length !== 0 ? (
                    <table className="table table-bordered border-separate border-spacing-y-1.5">
                        <thead>
                        <tr>
                            <th className={"text-left text-gray-500"}>{t("pages.songs.name")}</th>
                            <th className={"text-left text-gray-500"}>{t("pages.songs.org")}</th>
                            <th className={"text-left text-gray-500"}>{t("pages.songs.creationDate")}</th>
                            <th className={"text-left text-gray-500"}>{t("pages.songs.lastModified")}</th>
                            <th className={"text-left text-gray-500"}>{t("pages.songs.actions")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {songs.songs.map((elem: Song, index: number) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td colSpan={8} style={{backgroundColor: '#f0f0f0'}}/>
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
                    songs.songs.length == 0 &&
                    <div className="flex items-center justify-center p-4 md:p-5">
                        <h1 className="text-2xl text-fuchsia-950">
                            {t("pages.songs.none")}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SongsPage;