import { useState } from "react";
import { FaPenToSquare, FaXmark } from "react-icons/fa6";
import { UserService } from "../../service/userService";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState<string>();

    const { t } = useTranslation();

    type ChangePasswordFormData = {
        password: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordFormData>();

    watch("password");

    const submitChangePassword = async (data: ChangePasswordFormData) => {
        const response = await UserService.changePassword(data.password);
        if (response?.status == 200) setShowModal(false);
        else
            setChangePasswordError(
                t("components.changePasswordModal.error.change")
            );
    };

    return (
        <>
            <button
                aria-label="change password"
                data-modal-target="change-password-modal"
                data-modal-toggle="change-password-modal"
                type="button"
                onClick={() => setShowModal(true)}
                className="text-fuchsia-900  bg-slate-200 hover:bg-purple-300 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2"
            >
                <FaPenToSquare />
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div
                        id="change-password-modal"
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {t(
                                            "components.changePasswordModal.title"
                                        )}
                                    </h3>
                                    <button
                                        type="button"
                                        className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <FaXmark />
                                        <span className="sr-only">
                                            {t(
                                                "components.changePasswordModal.close"
                                            )}
                                        </span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5">
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSubmit(
                                            submitChangePassword
                                        )}
                                    >
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                {t(
                                                    "components.changePasswordModal.label"
                                                )}
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                placeholder="••••••••"
                                                {...register("password", {
                                                    required: true,
                                                    minLength: 8,
                                                })}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                required
                                            />
                                        </div>
                                        {errors.password && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t(
                                                        "components.changePasswordModal.error.length"
                                                    )}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {changePasswordError}
                                                </p>
                                            </>
                                        )}
                                        <button
                                            type="submit"
                                            className="w-full text-white bg-fuchsia-700 hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            {t(
                                                "components.changePasswordModal.send"
                                            )}
                                        </button>
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

export default ChangePasswordModal;
