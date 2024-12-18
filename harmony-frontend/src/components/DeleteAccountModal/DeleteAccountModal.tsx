import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { UserService } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    const navigate = useNavigate();
    const { t } = useTranslation();

    const submitDeleteAccount = async () => {
        const deleteAccountRes = await UserService.deleteAccount();
        if (deleteAccountRes.status == 200) {
            setShowModal(false);
            localStorage.removeItem("harmony-jwt")
            localStorage.removeItem("harmony-uid")
            localStorage.removeItem("harmony-profile-image")
            window.dispatchEvent(new Event("harmony"));
            window.dispatchEvent(new Event("harmony-pi"));
            navigate("/");
        } else setError(t("components.deleteAccountModal.error"));
    };

    return (
        <>
            <button
                aria-label="delete account"
                type="button"
                onClick={() => setShowModal(true)}
                className="text-fuchsia-900  bg-slate-200 hover:bg-purple-300 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2"
            >
                <FaTrash />
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10 transition-opacity"></div>
                    <div
                        id="delete-account-modal"
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="p-4 md:p-5 text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                                        {t(
                                            "components.deleteAccountModal.title"
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
                                            "components.deleteAccountModal.cancel"
                                        )}
                                    </button>
                                    <button
                                        data-modal-hide="delete-account-modal"
                                        type="button"
                                        onClick={submitDeleteAccount}
                                        className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                                    >
                                        {t("components.deleteAccountModal.yes")}
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

export default DeleteAccountModal;
