import React, {useEffect, useState} from "react";
import { FaRegEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {Album, AlbumPagination} from "../../types/dtos/Album";
import {Song} from "../../types/dtos/Song";
import {SongService} from "../../service/songService";
import {OrgService} from "../../service/orgService";
import Tooltip from "../Tooltip/Tooltip";

interface EditSongModalProps {
    song: Song;
    callback: (song: Song) => void
}

const EditSongModal = ({ song, callback }: EditSongModalProps) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();
    const [albums, setAlbums] = useState<AlbumPagination>();

    type EditSongFormData = {
        name: string;
        album: number;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<EditSongFormData>();

    watch();

    const { t } = useTranslation();

    useEffect(() => {
        console.log("Album: " + song.album)
        if (song.org)
            OrgService.getOrgAlbums(song.org as number).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json() as AlbumPagination;
                    setAlbums(info)
                }
            })
    }, []);

    const onSubmit = async (data: any, e: any) => {
        e.preventDefault()
        if (data.name == song.name && data.album == song.album) {
            setShowModal(false);
            return;
        }
        const edit = await SongService.editSong(song.id, data.name, data.album);
        if (edit?.status == 200) {
            setShowModal(false);
            edit.json().then((rsp) => {
                reset()
                callback(rsp);
            });

        } else setError(t("components.editSongModal.error.edit"));
    };

    return (
        <>
            <Tooltip message={t("pages.edit.edit")} margin="top-8">
                <button onClick={() => setShowModal(true)}
                        className={!showModal ?
                            "flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-100 h-10 w-10 justify-center items-center hover:bg-fuchsia-300"
                            : "flex text-xl text-fuchsia-950 rounded-full bg-fuchsia-300 h-10 w-10 justify-center items-center hover:bg-fuchsia-300"
                        }>
                    <FaRegEdit /></button>
            </Tooltip>
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
                                        {t("components.editSongModal.title")}
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
                                                defaultValue={song.name}
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
                                                    {t(
                                                        "components.editSongModal.error.name"
                                                    )}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        {albums && albums.albums.length != 0 && (
                                            <div>
                                                <select
                                                    id="name"
                                                    data-testid="create-song-org"
                                                    defaultValue={song.album? song.album : 0}
                                                    {...register("album", {
                                                        required: true,
                                                        min: 0,
                                                    })}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                    required
                                                >
                                                    {albums.albums.map((a: Album, index) => (
                                                        <option
                                                            key={index}
                                                            value={a.id}
                                                            label={a.name}
                                                        />
                                                    ))}
                                                    <option
                                                        className="text-gray-500"
                                                        value={0}
                                                        label={
                                                            t("components.editSongModal.select.noAlbum")
                                                        }
                                                    />

                                                </select>
                                                <>
                                                    <p className="text-gray-500 text-xs pl-2.5">
                                                        {t("components.editSongModal.select.single")}
                                                    </p>
                                                </>
                                            </div>
                                        )}
                                        {errors.album && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.editSongModal.error.album")}
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
                                                {t(
                                                    "components.editSongModal.cancel"
                                                )}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.editSongModal.edit"
                                                )}
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

export default EditSongModal;
