import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {AlbumService} from "../../service/albumService";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const DeleteAlbumModal = ({id}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    const { t } = useTranslation();

    const navigate = useNavigate();

    const submitDeleteAlbum = async () => {
        const deleted = await AlbumService.deleteAlbum(id);
        if (deleted?.status == 200) {
            setShowModal(false);
            navigate("/albums");
        } else setError(t("components.deleteAlbumModal.error"));
    };

    return (
        <>
            <button
                aria-label="delete album"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white w-fit h-fit flex items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full">
                <RiDeleteBin5Fill />
                {t("pages.albums.delete")}
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
                                            "components.deleteAlbumModal.title"
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
                                            "components.deleteAlbumModal.cancel"
                                        )}
                                    </button>
                                    <button
                                        data-modal-hide="delete-account-modal"
                                        type="button"
                                        onClick={submitDeleteAlbum}
                                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                                    >
                                        {t("components.deleteAlbumModal.yes")}
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

export default DeleteAlbumModal;
