import React, { useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { SongService } from "../../service/songService";
import { useForm } from "react-hook-form";
import { UserService } from "../../service/userService";

import {useTranslation} from "react-i18next";
import {Album, AlbumPagination} from "../../types/dtos/Album";
import {Org, OrgPagination} from "../../types/dtos/Org";
import {OrgService} from "../../service/orgService";
import {Song} from "../../types/dtos/Song";

const CreateSongModal = ({
    org,
    album,
    callback,
}: {
    org?: number;
    album?: number;
    callback: (song: Song) => void;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();
    const [orgs, setOrgs] = useState<Org[]>();
    const [albums, setAlbums] = useState<Album[]>()
    const [orgSelected, setOrgSelected] = useState<number>(org);
    
    console.log("album: " + album)

    const { t } = useTranslation();

    useEffect(() => {
        const userId = localStorage.getItem("harmony-uid") as string;
        UserService.getUserOrgs(userId).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json() as OrgPagination;
                setOrgs(info.orgs);
            }
        });
    }, []);

    useEffect(() => {
        if (orgSelected)
            OrgService.getOrgAlbums(orgSelected).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json() as AlbumPagination;
                    setAlbums(info.albums)
                }
            })
    }, [orgSelected]);

    type CreateSongFormData = {
        name: string;
        org: number;
        album: number;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<CreateSongFormData>();

    watch();

    const onSubmit = async (data: any, e: any) => {
        const song = await SongService.createSong(data.name, data.org, data.album);
        if (song?.status == 200) {
            setShowModal(false);
            const body = await song.json();
            SongService.getSongById(body.id).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json();
                    reset()
                    callback(info)
                }
            });
        } else {
            setError("Error creating song");
        }

    };

    return (
        <>
            <button
                aria-label="create song"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white flex justify-center items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
            >
                <IoAddSharp className="font-bold" />
                {t("components.createSongModal.button")}
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10 transition-opacity"></div>
                    <div
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        {t("components.createSongModal.title")}
                                    </h3>
                                </div>
                                <div className="p-4 md:p-5">
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div>
                                            <input
                                                type="text"
                                                id="name"
                                                data-testid="create-org-name"
                                                placeholder={t("components.createSongModal.name")}
                                                {...register("name", {
                                                    required: true,
                                                    maxLength: 50,
                                                })}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.createSongModal.error.name")}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        {orgs && (
                                            <div>
                                                <select
                                                    id="name"
                                                    data-testid="create-song-org"
                                                    defaultValue={org == null? 0: org}
                                                    {...register("org", {
                                                        onChange: (o) => {
                                                            setOrgSelected(o.target.value)
                                                        },
                                                        required: true,
                                                        min: 1,
                                                    })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    required
                                                >
                                                    {orgs.map((o: any, index) => (
                                                        <option
                                                            key={index}
                                                            value={o.id}
                                                            label={o.name}
                                                        />
                                                    ))}
                                                    {!org && (
                                                        <option
                                                            value={0}
                                                            label={
                                                                t("components.createSongModal.select.org")
                                                            }
                                                        />
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                        {errors.org && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.createSongModal.error.org")}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        {albums && albums.length != 0 && (
                                            <div>
                                                <select
                                                    id="name"
                                                    data-testid="create-song-org"
                                                    defaultValue={album == null? 0: album}
                                                    {...register("album", {
                                                        required: true,
                                                        min: 0,
                                                    })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    required
                                                >
                                                    {albums.map((a: Album, index) => (
                                                        <option
                                                            key={index}
                                                            value={a.id}
                                                            label={a.name}
                                                        />
                                                    ))}
                                                    {!album && (
                                                        <option
                                                            value={0}
                                                            label={
                                                                t("components.createSongModal.select.album")
                                                            }
                                                        />
                                                    )}
                                                </select>
                                                <>
                                                    <p className="text-gray-500 text-xs pl-2.5">
                                                        {t("components.createSongModal.select.noAlbum")}
                                                    </p>
                                                </>
                                            </div>
                                        )}
                                        {errors.album && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.createSongModal.error.org")}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        <div className="flex flex-row gap-5 justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                                className="bg-transparent text-fuchsia-950 border hover:border-fuchsia-950 border-white py-2 px-4 rounded-full"
                                            >
                                                {t("components.createSongModal.cancel")}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t("components.createSongModal.create")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CreateSongModal;
