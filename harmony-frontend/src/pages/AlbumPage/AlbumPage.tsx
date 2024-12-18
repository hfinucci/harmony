import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import SongCard from "../../components/SongCard/SongCard";
import { AlbumService } from "../../service/albumService";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";

import DeleteAlbumModal from "../../components/DeleteAlbumModal/DeleteAlbumModal";
import EditAlbumModal from "../../components/EditAlbumModal/EditAlbumModal";
import { useTranslation } from "react-i18next";
import {Song, SongPagination} from "../../types/dtos/Song";
import {Album} from "../../types/dtos/Album.ts";
import ALBUM_IMAGE_DEFAULT from "../../assets/album-default-image.png"
import ErrorPage from "../ErrorPage/ErrorPage.tsx";
import Loading from "../../components/Loading/Loading.tsx";
import {ImageService} from "../../service/imageService.ts";
import {Org} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import Pagination from "../../components/Pagination/Pagination";
import {BASE64_HEADER, IMAGE_TYPE} from "../../utils.ts";

const AlbumPage = () => {
    const [album, setAlbum]: Album = useState();
    const [org, setOrg]: Org = useState();
    const [songs, setSongs] = useState<SongPagination>();
    const [image, setImage] = useState(ALBUM_IMAGE_DEFAULT);
    const [errorCode, setErrorCode] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [imageReload, setImageReload] = useState<number>(Date.now())

    const [page, setPage] = useState<number>(1);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const albumId = useParams();

    const nav = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        AlbumService.getAlbumById(Number(albumId.id))
            .then(async (rsp) => {
                switch (rsp.status) {
                    case 200:
                        const info = await rsp.json();
                        setAlbum(info);
                        break;
                    case 401:
                        localStorage.removeItem("harmony-jwt");
                        localStorage.removeItem("harmony-uid");
                        nav("/login");
                        break;
                    case 403:
                        console.log("FORBIDDEN")
                        setErrorCode(403);
                        setErrorMsg("pages.error.album.forbidden");
                        break;
                    case 404:
                    default:
                        setErrorCode(404);
                        setErrorMsg("pages.error.album.notFound");
                        break;
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (album) {
            fetchImage(album.id);
        }
    }, [album, imageReload]);

    useEffect( () => {
        if (album) {
            OrgService.getOrg(album.org).then(async (rsp) => {
                const o = await rsp.json()
                setOrg(o)
            }
        )
        }
    }, [album]);

    const fetchImage = async (id: number) => {
        setImage(ALBUM_IMAGE_DEFAULT)
        const response = await ImageService.getImage(id, IMAGE_TYPE.ALBUM);
        if (response.ok) {
            const imgResponse = await response.json()
            setImage(BASE64_HEADER + imgResponse.image);
        }
    }

    const fetchSongs = async () => {
        await AlbumService.getAlbumSongs(Number(albumId.id), page, 10).then(async (rsp) => {
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
    }, [album, page]);

    const addSong = (song: any) => {
        nav("/songs/" + song.id)
    };

    const editAlbum = (album: Album) => {
        setAlbum(album);
    };

    if (loading) {
        return <Loading />;
    }

    if (errorCode) {
        return <ErrorPage code={errorCode} msg={errorMsg} />;
    }

    return (
        <div>
            <div className="my-10 justify-items-stretch px-10">
                {album &&
                    <div className="flex flex-row">
                        <div className="h-1/4 w-1/4">
                            <img src={image}  alt="album image" className="shadow-lg rounded"/>
                        </div>
                        <div className="m-5 flex w-full justify-between">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-start text-5xl text-fuchsia-950 drop-shadow-lg">
                                    {album.name}
                                </h1>
                                {org &&
                                    <h1 className="text-start text-lg text-fuchsia-700">
                                        {t("pages.album.from")}{org.name}
                                    </h1>
                                }
                            </div>
                            <div className="flex gap-2 items-start mr-5">
                                <DeleteAlbumModal id={album.id} />
                                <EditAlbumModal album={album} callback={editAlbum} reloadImage={setImageReload} />
                            </div>
                        </div>
                    </div>
                }
                <div className="flex flex-col grow gap-2">
                    {org &&
                        <div className="flex justify-end">
                            <CreateSongModal album={albumId.id} org={org.id} callback={addSong}/>
                        </div>
                    }
                    {songs && songs.songs.length !== 0 ? (
                        <div className=" flex flex-col rounded-lg bg-white p-10">
                            <table className="table table-bordered border-separate border-spacing-y-1.5">
                                <thead>
                                <tr className="grid grid-cols-4 w-full">
                                    <th
                                        className={
                                            "text-left text-gray-500"
                                        }
                                    >
                                        {t("pages.album.songs.name")}
                                    </th>
                                    <th
                                        className={
                                            "text-left text-gray-500"
                                        }
                                    >
                                        {t("pages.album.songs.creationDate")}
                                    </th>
                                    <th
                                        className={
                                            "text-left text-gray-500"
                                        }
                                    >
                                        {t("pages.album.songs.lastModified")}
                                    </th>
                                    <th
                                        className={
                                            "text-left text-gray-500"
                                        }
                                    >
                                        {t("pages.album.songs.actions")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {songs.songs.map((elem: Song, index: number) => (
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
                            {songs.totalPages > 1 &&
                                <Pagination page={songs.page} totalPages={songs.totalPages}
                                            onPageChange={handlePageChange}/>
                            }
                        </div>
                    ) : (
                        songs && songs.songs.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.album.songs.none")}
                                </h1>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumPage;
