import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import SongCard from "../../components/SongCard/SongCard";
import { OrgService } from "../../service/orgService";
import { FaMusic } from "react-icons/fa";
import { RiAlbumFill } from "react-icons/ri";
import CreateSongModal from "../../components/CreateSongModal/CreateSongModal";
import AddMemberModal from "../../components/AddMemberModal/AddMemberModal";

import DeleteOrgModal from "../../components/DeleteOrgModal/DeleteOrgModal";
import EditOrgModal from "../../components/EditOrgModal/EditOrgModal";
import { useTranslation } from "react-i18next";
import {SinglePagination, Song, SongPagination} from "../../types/dtos/Song";
import { Org } from "../../types/dtos/Org";
import { ORG_IMAGE_DEFAULT } from "../../utils.ts";
import ErrorPage from "../ErrorPage/ErrorPage.tsx";
import Loading from "../../components/Loading/Loading.tsx";
import {ImageService} from "../../service/imageService.ts";
import {Album, AlbumPagination} from "../../types/dtos/Album";
import AlbumExtendedCard from "../../components/AlbumExtendedCard/AlbumExtendedCard";
import CreateAlbumModal from "../../components/CreateAlbumModal/CreateAlbumModal";
import Pagination from "../../components/Pagination/Pagination";

const OrgPage = () => {
    const [org, setOrg]: any = useState();
    const [members, setMembers]: any = useState();
    const [songs, setSongs] = useState<SongPagination>();
    const [singles, setSingles] = useState<SinglePagination>();
    const [albums, setAlbums] = useState<AlbumPagination>()
    const [image, setImage] = useState(ORG_IMAGE_DEFAULT);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorCode, setErrorCode] = useState<number>();
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [imageReload, setImageReload] = useState<number>(Date.now())

    const [albumPage, setAlbumPage] = useState<number>();

    const handleAlbumPageChange = (newPage) => {
        setAlbumPage(newPage);
    };

    const [songPage, setSongPage] = useState<number>();

    const handleSongPageChange = (newPage) => {
        setSongPage(newPage);
    };

    const [singlePage, setSinglePage] = useState<number>();

    const handleSinglePageChange = (newPage) => {
        setSinglePage(newPage);
    };

    const orgId = useParams();

    const nav = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        OrgService.getOrg(Number(orgId.id))
            .then(async (rsp) => {
                switch (rsp.status) {
                    case 200:
                        const info = await rsp.json();
                        setOrg(info);
                        break;
                    case 401:
                        localStorage.removeItem("harmony-jwt");
                        localStorage.removeItem("harmony-uid");
                        nav("/login");
                        break;
                    case 403:
                        console.log("FORBIDDEN")
                        setErrorCode(403);
                        setErrorMsg("pages.error.org.forbidden");
                        break;
                    case 404:
                    default:
                        setErrorCode(404);
                        setErrorMsg("pages.error.org.notFound");
                        break;
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        OrgService.getOrgMembers(Number(orgId.id)).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                setMembers(info);
            }
        });
    }, [org]);

    useEffect(() => {
        OrgService.getOrgAlbums(Number(orgId.id), albumPage).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json() as AlbumPagination;
                setAlbums(info);
            }
        });
    }, [org, albumPage]);

    useEffect(() => {
        if (org) {
            fetchImage(org.image);
        }
    }, [org, imageReload]);

    const fetchImage = async (url: string) => {
        const response = await ImageService.getImage(url);
        if (response.ok) {
            url = URL.createObjectURL(await response.blob());
            setImage(url);
        } else {
            setImage(ORG_IMAGE_DEFAULT)
        }
    }

    const fetchSongs = async () => {
        await OrgService.getOrgSongs(Number(orgId.id), songPage).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json() as SongPagination;
                setSongs(info);
            }
        });
    };

    const fetchSingles = async () => {
        await OrgService.getOrgSingles(Number(orgId.id), singlePage).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json() as SinglePagination;
                setSingles(info);
            }
        });
    };

    useEffect(() => {
        console.log("En fetch song")
        const fetch = async () => {
            await fetchSongs();
        };
        fetch();
    }, [org, songPage]);

    useEffect(() => {
        const fetch = async () => {
            await fetchSingles();
        };
        fetch();
    }, [org, singlePage]);

    const addSong = (song: any) => {
        nav("/songs/" + song.id)
    };

    const editOrg = (org: Org) => {
        setOrg(org);
    };

    if (loading) {
        return <Loading />;
    }

    if (errorCode) {
        return <ErrorPage code={errorCode} msg={errorMsg} />;
    }

    return (
        <div>
            <div className="absolute z-1 bg-gradient-to-t from-black w-full h-96 bg-cover bg-center" />
            <header
                className={
                    "w-full -mt-24 h-96 bg-cover bg-center flex justify-start items-end"
                }
                style={{ backgroundImage: `url(${image})` }}
            >
                {org && (
                    <div className="flex w-full z-10 justify-between">
                        <h1 className="m-5 text-center text-5xl text-white drop-shadow-lg">
                            {org.name}
                        </h1>
                        <div className="flex gap-2 items-center mr-5">
                            <DeleteOrgModal id={org.id} />
                            <EditOrgModal org={org} callback={editOrg} reloadImage={setImageReload} />
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
                                <Pagination page={songs.page} totalPages={songs.totalPages} onPageChange={handleSongPageChange}/>
                            }
                        </div>
                    ) : (
                        songs && songs.songs.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.org.songs.none")}
                                </h1>
                            </div>
                        )
                    )}

                    <div className="flex justify-between mt-5">
                        <div className="flex items-center gap-3">
                            <RiAlbumFill className="text-2xl text-fuchsia-950" />
                            <h1 className="text-2xl text-fuchsia-950 font-semibold">
                                {t("pages.org.albums.title")}
                            </h1>
                        </div>
                        <CreateAlbumModal callback={(album) => nav("/albums/" + album.id)} />
                    </div>

                    {albums && albums.albums.length != 0 ? (
                        <div className=" flex flex-col rounded-lg bg-white">
                            {albums.albums.map((elem: Album) => (
                                <AlbumExtendedCard
                                    key={elem.id}
                                    id={elem.id}
                                    name={elem.name}
                                    org={elem.org}
                                    image={elem.image}
                                />
                            ))}
                            {albums.totalPages > 1 &&
                                <Pagination page={albums.page} totalPages={albums.totalPages} onPageChange={handleAlbumPageChange}/>
                            }
                        </div>
                    ) : (
                        albums && albums.albums.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.org.albums.none")}
                                </h1>
                            </div>
                        )
                    )
                    }

                    <div className="flex justify-between mt-5">
                        <div className="flex items-center gap-3">
                            <FaMusic className="text-2xl text-fuchsia-950" />
                            <h1 className="text-2xl text-fuchsia-950 font-semibold">
                                {t("pages.org.singles.title")}
                            </h1>
                        </div>
                        <CreateSongModal org={orgId.id} callback={addSong} />
                    </div>
                    {singles && singles.singles.length !== 0 ? (
                        <div className=" flex flex-col rounded-lg bg-white p-10">
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
                                {singles.singles.map((elem: Song) => (
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
                                                    lastmodified:
                                                    elem.lastmodified,
                                                } as Song
                                            }
                                            fetchSongs={fetchSingles}
                                        />
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                            {singles.totalPages > 1 &&
                                <Pagination page={singles.page} totalPages={singles.totalPages} onPageChange={handleSinglePageChange}/>
                            }
                        </div>
                    ) : (
                        singles && singles.singles.length == 0 && (
                            <div className="flex items-center justify-center p-4 md:p-5">
                                <h1 className="text-2xl text-fuchsia-950">
                                    {t("pages.org.singles.none")}
                                </h1>
                            </div>
                        )
                    )}
                </div>
                <div className="flex flex-col shrink gap-2 mr-10 w-fit">
                    <h1 className="text-2xl text-fuchsia-950 font-semibold">
                        {t("pages.org.members")}
                    </h1>
                    <div className=" flex flex-col rounded-lg bg-white p-5 justify-between">
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
