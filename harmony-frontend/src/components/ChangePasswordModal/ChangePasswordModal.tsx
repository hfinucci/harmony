import React, { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
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
        reset
    } = useForm<ChangePasswordFormData>();

    watch("password");

    const submitChangePassword = async (data: ChangePasswordFormData) => {
        const response = await UserService.changePassword(data.password);
        if (response?.status == 200) {
            reset()
            setShowModal(false);
        }
        else
            setChangePasswordError(
                t("components.changePasswordModal.error.change")
            );
    };

    return (
        <>
            <button
                aria-label="change password"
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
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        {t("components.changePasswordModal.title")}
                                    </h3>
                                </div>
                                <div className="p-4 md:p-5">
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSubmit(submitChangePassword)}
                                    >
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block mb-2 text-sm font-medium text-gray-900"
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
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                                        <div className="flex flex-row gap-5 justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                                className="bg-transparent text-fuchsia-950 border hover:border-fuchsia-950 border-white py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.changePasswordModal.close"
                                                )}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.changePasswordModal.send"
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

export default ChangePasswordModal;
