import React, {useEffect, useState} from "react";
import { IoPersonAdd } from "react-icons/io5";
import {useForm} from "react-hook-form";
import {OrgService} from "../../service/orgService";
import { RiDeleteBin5Fill } from "react-icons/ri";

const AddMemberModal = ({org}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();
    const [members, setMembers] = useState<any>();

    useEffect(() => {
        OrgService.getOrgMembers(org).then(async (rsp) => {
            if(rsp?.status == 200){
                const info = await rsp.json()
                setMembers(info)
            }
        })
    }, [])

    type AddMemberFormData = {
        name: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AddMemberFormData>();

    watch();

    const onSubmit = async (data:any, e: any) => {
        console.log("Mandar mail...")
        setShowModal(false)
    };

    const deleteMember = async (member: any) => {
        console.log("Eliminar miembro...")
        setShowModal(false)
    }

    return (
        <>
            <button
                aria-label="create song"
                data-modal-target="create-song-modal"
                data-modal-toggle="create-song-modal"
                type="button"
                onClick={() => setShowModal(true)}
                className="items-center bg-white w-fit flex items-center gap-2 text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-1 px-4 rounded-full">
                <IoPersonAdd />
                Add member
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div
                        id="create-song-modal"
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        Invitar Miembro
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
                                                })}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    Debe escribir un nombre
                                                </p>
                                                <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                                                    {error}
                                                </p>
                                            </>
                                        )}
                                        {members &&
                                            <div className="flow-root">
                                                <ul role="list"
                                                    className="divide-y divide-gray-200">
                                                    {members.map((member: any) => (
                                                        <li className="py-3 sm:py-4">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img className="w-8 h-8 rounded-full"
                                                                         src={member.image}
                                                                         alt="Profile Image"/>
                                                                </div>
                                                                <div className="flex-1 min-w-0 ms-4">
                                                                    <p className="text-sm font-light text-gray-800 truncate">
                                                                        {member.name}
                                                                    </p>
                                                                </div>
                                                                {member.id === localStorage.getItem('harmony-uid') as string &&
                                                                    <button
                                                                        className="inline-flex items-center text-fuchsia-950" onClick={deleteMember}>
                                                                        <RiDeleteBin5Fill />
                                                                    </button>
                                                                }
                                                            </div>
                                                        </li>
                                                    ))}
                                                    </ul>
                                            </div>
                                        }
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
                                                Enviar Invitación
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

export default AddMemberModal;
