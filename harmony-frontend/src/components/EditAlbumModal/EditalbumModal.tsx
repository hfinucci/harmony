import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AlbumService } from "../../service/albumService";
import { Album } from "../../types/dtos/Album";
import { toBase64 } from "../../utils";

interface EditAlbumModalProps {
    album: Album;
    callback: (album: Album) => void;
    reloadImage:  React.Dispatch<React.SetStateAction<number>>;
}

const EditAlbumModal = ({ album, callback, reloadImage }: EditAlbumModalProps) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    type EditAlbumFormData = {
        name: string;
        image: FileList;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<EditAlbumFormData>();

    watch();

    const { t } = useTranslation();

    const onSubmit = async (data: any, e: any) => {
        if (data.name == album.name && !data.image) {
            setShowModal(false);
            return;
        }
        const image = data.image[0] ? await toBase64(data.image[0]) : null;
        const edit = await AlbumService.editAlbum(album.id, data.name, image);
        if (edit?.status == 200) {
            setShowModal(false);
            edit.json().then((rsp) => {
                reset()
                callback(rsp);
            });

            if (image != null) {
                reloadImage(Date.now())
            }
        } else setError(t("components.editAlbumModal.error.edit"));
    };

    return (
        <>
            <button
                aria-label="edit album"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white w-fit h-fit flex items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
            >
                <FaRegEdit />
                {t("pages.albums.edit")}
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
                                        {t("components.editAlbumModal.title")}
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
                                                defaultValue={album.name}
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
                                                        "components.editAlbumModal.error.name"
                                                    )}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        <label className="block mb-2 text-sm font-medium text-fuchsia-950">
                                            {t(
                                                "components.editAlbumModal.upload"
                                            )}
                                        </label>
                                        <input
                                            className="block w-full text-sm text-fuchsia-950 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-fuchsia-400"
                                            aria-describedby="user_avatar_help"
                                            id="user_avatar"
                                            type="file"
                                            accept="image/*"
                                            {...register("image")}
                                        />
                                        {errors.image && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t(
                                                        "components.createAlbumModal.error.image"
                                                    )}
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
                                                    "components.editAlbumModal.cancel"
                                                )}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.editAlbumModal.edit"
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

export default EditAlbumModal;
