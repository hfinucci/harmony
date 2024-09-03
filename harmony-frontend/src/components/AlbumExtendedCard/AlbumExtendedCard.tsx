import {Album} from "../../types/dtos/Album";
import {Song, SongPagination} from "../../types/dtos/Song";
import React, {useEffect, useState} from "react";
import SongCard from "../SongCard/SongCard";
import {useNavigate} from "react-router-dom";
import {AlbumService} from "../../service/albumService";
import {useTranslation} from "react-i18next";
import {ORG_IMAGE_DEFAULT} from "../../utils";

const AlbumExtendedCard = (album: Album) => {

    const [songs, setSongs] = useState<SongPagination>()
    const [image, setImage] = useState<string>(album.image);
    const limit = 5;


    const nav = useNavigate();
    const { t } = useTranslation();

    const fetchSongs = async () => {
        await AlbumService.getAlbumSongs(Number(album.id), 1, limit).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json() as SongPagination;
                setSongs(info);
            }
        });
    };

    useEffect(() => {
        const fetch = async () => {
            await fetchSongs();
        };
        fetch();
    }, []);

    return (
        <div className=" flex flex-row shadow-md p-10 w-full">
            <img
                className="max-h-64 max-w-64 object-contain rounded-t-lg justify-center m-5"
                src={image + "?reload=" + Date.now()}
                onError={() => {
                    setImage(ORG_IMAGE_DEFAULT);
                }}
                alt="album image"
            />
            <div className="flex flex-col w-full h-fit">
                <div className="flex flex-row justify-between">
                    <h5 className="mb-3 text-2xl font-extralight tracking-tight text-gray-400">
                        {album.name}
                    </h5>
                    <button
                        onClick={() => nav("/albums/" + album.id)}
                        aria-label="see more albums"
                        type="button"
                        className="bg-white flex w-fit h-fit items-center self-center text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
                    >
                        {t("pages.org.albums.see")}
                    </button>
                </div>
                {songs && songs.songs.length !== 0 ? (
                    <table className="table table-bordered border-separate border-spacing-y-1.5">
                        <thead>
                        <tr className="grid grid-cols-4 w-full">
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
                        {songs.songs.map((elem: Song) => (
                            <React.Fragment key={elem.id}>
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
                                            lastmodified: elem.lastmodified,
                                        } as Song
                                    }
                                    fetchSongs={fetchSongs}
                                />
                            </React.Fragment>
                        ))}
                        {songs.totalPages > 1 &&
                            <React.Fragment key={-1}>
                                <tr>
                                    <td
                                        colSpan={8}
                                        style={{
                                            backgroundColor:
                                                "#f0f0f0",
                                        }}
                                    />
                                </tr>
                                <tr>
                                    <td className="text-gray-500">{ songs.totalItems - limit } {songs.totalItems - limit > 1? t("pages.org.albums.moreSongs") : t("pages.org.albums.oneSong")}</td>
                                </tr>
                            </React.Fragment>
                        }
                        </tbody>
                    </table>
                ) : (
                    songs?.songs.length == 0 && (
                        <div className="flex items-center justify-center p-4 md:p-5">
                            <h1 className="text-2xl text-fuchsia-950">
                                {t("pages.org.albums.noneSongs")}
                            </h1>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default AlbumExtendedCard;