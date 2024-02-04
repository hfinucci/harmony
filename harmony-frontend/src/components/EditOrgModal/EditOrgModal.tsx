import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {OrgService} from "../../service/orgService";
import {Org} from "../OrgCard/OrgCard";

interface EditOrgModalProps {
    org: Org;
    callback: (org: Org) => void;
}

const EditOrgModal = ({org, callback}: EditOrgModalProps) => {

    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    type EditOrgFormData = {
        name: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<EditOrgFormData>();

    watch();

    const { t } = useTranslation();

    const onSubmit = async (data:any, e: any) => {
        if(data.name == org.name) {
            setShowModal(false);
            return
        }
        const edit = await OrgService.editOrg(org.id, data.name);
        if (edit?.status == 200) {
            setShowModal(false);
            edit.json().then((rsp) => {
                callback(rsp)
            })
        } else setError(t("components.editOrgModal.error.edit"));
    };

    return (
        <>
            <button
                aria-label="create song"
                data-modal-target="create-song-modal"
                data-modal-toggle="create-song-modal"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white w-fit h-fit flex items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full">
                <FaRegEdit />
                {t("pages.orgs.edit")}
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div
                        id="create-org-modal"
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        {t("components.editOrgModal.title")}
                                    </h3>
                                </div>
                                <div className="p-4 md:p-5">
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSubmit(
                                            onSubmit
                                        )}
                                    >
                                        <div>
                                            <input
                                                type="text"
                                                id="name"
                                                defaultValue={org.name}
                                                {...register("name", {
                                                    required: true,
                                                    maxLength: 20
                                                })}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {t("components.editOrgModal.error.name")}
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        <div className="flex flex-row gap-5 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="bg-transparent text-fuchsia-950 border hover:border-fuchsia-950 border-white py-2 px-4 rounded-full"
                                            >
                                                {t("components.editOrgModal.cancel")}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t("components.editOrgModal.edit")}
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

export default EditOrgModal;
