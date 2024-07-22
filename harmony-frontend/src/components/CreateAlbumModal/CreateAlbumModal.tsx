import React, { useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { AlbumService } from "../../service/albumService";
import { useForm } from "react-hook-form";
import { UserService } from "../../service/userService";
import { Album } from "../../types/dtos/Album";
import {useTranslation} from "react-i18next";

const CreateAlbumModal = ({
                             org,
                             callback,
                         }: {
    org?: number;
    callback: (album: Album) => void;
}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();
    const [orgs, setOrgs] = useState<any>();

    const { t } = useTranslation();

    useEffect(() => {
        const userId = localStorage.getItem("harmony-uid") as string;
        UserService.getUserOrgs(userId).then(async (rsp) => {
            if (rsp?.status == 200) {
                const info = await rsp.json();
                setOrgs(info);
            }
        });
    }, []);

    type CreateAlbumFormData = {
        name: string;
        org: number;
        image: FileList; //TODO: create with image
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<CreateAlbumFormData>();

    watch();

    const onSubmit = async (data: any, e: any) => {
        const album = await AlbumService.createAlbum(data.name, data.org);
        if (album?.status == 200) {
            setShowModal(false);
            const body = await album.json();
            AlbumService.getAlbumById(body.id).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json();
                    reset()
                    callback(info)
                }
            });
        } else {
            setError("Error creating album");
        }

    };

    return (
        <>
            <button
                aria-label="create album"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white flex justify-center items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
            >
                <IoAddSharp className="font-bold" />
                {t("components.createAlbumModal.button")}
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        {t("components.createAlbumModal.title")}
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
                                                placeholder={t("components.createAlbumModal.name")}
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
                                                    {t("components.createAlbumModal.error.name")}
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
                                                    data-testid="create-album-org"
                                                    defaultValue={org == null? 0: org}
                                                    {...register("org", {
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
                                                                t("components.createAlbumModal.select")
                                                            }
                                                        />
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                        {errors.org && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.createAlbumModal.error.org")}
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
                                                {t("components.createAlbumModal.cancel")}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t("components.createAlbumModal.create")}
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

export default CreateAlbumModal;
