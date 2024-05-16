import React, { useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { SongService } from "../../service/songService";
import { useForm } from "react-hook-form";
import { UserService } from "../../service/userService";
import { Song } from "../../pages/SongsPage/SongsPage";
import {useTranslation} from "react-i18next";

const CreateSongModal = ({
    org,
    callback,
}: {
    org?: number;
    callback: (song: Song) => void;
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

    type CreateSongFormData = {
        name: string;
        org: number;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateSongFormData>();

    watch();

    const onSubmit = async (data: any, e: any) => {
        const song = await SongService.createSong(data.name, data.org);
        if (song?.status == 200) {
            setShowModal(false);
            const body = await song.json();
            SongService.getSongById(body.id).then(async (rsp) => {
                if (rsp?.status == 200) {
                    const info = await rsp.json();
                    callback(info);
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
                Add Song
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
                                                placeholder={t("components.createSongModal.name")}
                                                {...register("name", {
                                                    required: true,
                                                    minLength: 8,
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
                                                    defaultValue={org}
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
                                                            selected={org == o}
                                                        />
                                                    ))}
                                                    {!org && (
                                                        <option
                                                            value={0}
                                                            label={
                                                                t("components.createSongModal.select")
                                                            }
                                                            disabled={true}
                                                            selected={true}
                                                        />
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                        {errors.org && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.createSongModal.select")}
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
