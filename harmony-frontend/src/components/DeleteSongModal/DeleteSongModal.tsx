import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import {SongService} from "../../service/songService";

const DeleteSongModal = ({songId, callback} : {
    songId: number,
    callback: () => void
}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    const { t } = useTranslation();

    const submitDeleteSong = async () => {
        const deleted = await SongService.deleteSongs(songId)
        if (deleted?.status == 200) {
            setShowModal(false);
            callback()
        } else setError(t("components.deleteSongModal.error"));
    };

    return (
        <>
            <button
                aria-label="delete org"
                type="button"
                onClick={() => setShowModal(true)}
                className={"hover:text-fuchsia-700 flex justify-center mr-8"}>
                <MdDelete />
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
                                <div className="p-4 md:p-5 text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                                        {t(
                                            "components.deleteSongModal.title"
                                        )}
                                    </h3>
                                    {error && (
                                        <div className="text-red-500">
                                            {error}
                                        </div>
                                    )}
                                    <button
                                        data-modal-hide="delete-account-modal"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                    >
                                        {t(
                                            "components.deleteSongModal.cancel"
                                        )}
                                    </button>
                                    <button
                                        data-modal-hide="delete-account-modal"
                                        type="button"
                                        onClick={submitDeleteSong}
                                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                                    >
                                        {t("components.deleteSongModal.yes")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DeleteSongModal;
