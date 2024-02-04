import React, { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {OrgService} from "../../service/orgService";
import {useForm} from "react-hook-form";

const CreateOrgModal = () => {

    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();

    type CreateOrgFormData = {
        name: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateOrgFormData>();

    watch();

    const nav = useNavigate();

    const onSubmit = async (data:any, e: any) => {
        const org = await OrgService.createOrg(data.name);
        if (org?.status == 200) {
            const orgJson = await org.json();
            nav(`/orgs/${orgJson.id}`);
        } else {
            setError("Error creating org");
        }
    };

    return (
        <>
            <button
                aria-label="create org"
                data-modal-target="create-org-modal"
                data-modal-toggle="create-org-modal"
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white flex w-fit h-fit items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full"
            >
                <IoAddSharp className="font-bold"/>
                Create Org
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
                                        Crear Organización
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
                                                placeholder="Name"
                                                {...register("name", {
                                                    required: true,
                                                    minLength: 8
                                                })}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    El nombre de la organización debe tener al menos 8 caracteres
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
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                Crear
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

export default CreateOrgModal;
