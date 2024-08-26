import React, { useEffect, useState } from "react";
import { UserService } from "../../service/userService.ts";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import { RiAlbumFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import {Album, AlbumPagination} from "../../types/dtos/Album.ts";
import { useNavigate } from "react-router-dom";
import CreateAlbumModal from "../../components/CreateAlbumModal/CreateAlbumModal";
import Pagination from "../../components/Pagination/Pagination";

const AlbumsPage = () => {
    const [albums, setAlbums] = useState<AlbumPagination>();
    const [page, setPage] = useState<number>();

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const { t } = useTranslation();

    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const userId = localStorage.getItem("harmony-uid") as string;
            const response = await UserService.getUserAlbums(userId, page);
            const albums = (await response.json()) as AlbumPagination;
            setAlbums(albums);
        })();
    }, [page]);

    return (
        <div className="container h-screen mt-8 mx-auto max-w-12xl">
            <div className="flex flex-row justify-between items-center">
                <div className="text-fuchsia-950 text-4xl mb-4 flex flex-row gap-3 items-center">
                    <RiAlbumFill />
                    <h1>{t("pages.albums.title")}</h1>
                </div>
                <CreateAlbumModal callback={(album) => nav("/albums/" + album.id)}/>
            </div>
            {albums && albums.albums.length > 0 && (
                <>
                    <div data-testid={"albums-page-albums"} className="flex flex-row flex-wrap gap-5 justify-start rounded-lg p-5">
                        {albums.albums.map((elem: Album) => (
                            <AlbumCard
                                key={elem.id}
                                name={elem.name}
                                image={elem.image}
                                org={elem.org}
                                id={elem.id}
                            />
                        ))}
                    </div>
                    {albums.totalPages > 1 &&
                        <Pagination page={albums.page} totalPages={albums.totalPages} onPageChange={handlePageChange}/>
                    }
                </>
            )}
            {albums && albums.albums.length == 0 && (
                <div className="flex items-center justify-center p-4 md:p-5">
                    <h1 className="text-2xl text-fuchsia-950">
                        {t("pages.albums.noAlbums")}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default AlbumsPage;
