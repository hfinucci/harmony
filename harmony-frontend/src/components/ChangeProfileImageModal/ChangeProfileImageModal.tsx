import React, {useEffect, useState} from "react";
import { RiImageEditFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {UserService} from "../../service/userService";
import {ImageService} from "../../service/imageService";

interface ImageProp {
    url: string;
    name: string;
}

const ChangeProfileImageModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>();
    const [images, setImages] = useState<ImageProp[]>();
    const [selected, setSelected] = useState<ImageProp>();

    const { t } = useTranslation();

    useEffect(() => {
        if(showModal) {
            ImageService.getProfileImages().then(async (rsp) => {
                if (rsp?.status == 200) {
                    rsp.json().then((response) => {
                        const imgs = response.map((img) => {return {url: img, name: img.split("/")[img.split("/").length - 1]}}) as ImageProp[]
                        setImages(imgs);
                    })
                } else setError(t("components.changeProfileImageModal.error.fetch"));
            });
            const current = localStorage.getItem("harmony-profile-image")
            setSelected({url: current, name: current.split("/")[current.split("/").length - 1]})
        }
    }, [showModal]);

    type ChangeProfileImageFormData = {
        image: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangeProfileImageFormData>();

    watch();

    const onSubmit = async (data: any, e: any) => {
        if (!data.image || localStorage.getItem("harmony-profile-image").includes(data.image)) {
            setShowModal(false);
            return;
        }
        const edit = await UserService.changeProfileImage(localStorage.getItem("harmony-uid") as number, data.image);
        if (edit?.status == 200) {
            setShowModal(false);
            localStorage["harmony-profile-image"] = await edit.text();
            window.dispatchEvent(new Event("harmony-pi"))

        } else setError(t("components.changeProfileImageModal.error.edit"));
    };

    const changeSelection = (img: ImageProp) => {
        setSelected(img)
    }

    return (
        <>
            <button
                aria-label="change image"
                type="button"
                onClick={() => setShowModal(true)}
                className="text-fuchsia-900 bg-slate-200 hover:bg-purple-300 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2"
            >
                <RiImageEditFill />
            </button>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-10 transition-opacity"></div>
                    <div
                        tabIndex={-1}
                        className="fixed inset-0 z-10 w-screen overflow-y-auto flex justify-center items-center"
                    >
                        <div className="relative p-4 w-full max-w-md max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-center p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-gray-500 font-light">
                                        {t("components.changeProfileImageModal.title")}
                                    </h3>
                                </div>
                                {error && (
                                    <div className="text-center text-red-500">
                                        {error}
                                    </div>
                                )}
                                <div className="p-4 md:p-5">
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className="flex flex-row justify-center flex-wrap">
                                            {images &&
                                                images.map((img: ImageProp, index: number) =>
                                                    <div className="h-12 w-12" key={index}>
                                                        <label data-testid={img.name} htmlFor={img.name + "-s"} id={img.name + "-label"}
                                                               onClick={() => {
                                                                   changeSelection(img)
                                                               }}>
                                                            <img alt="Profile option" src={img.url} className={img.name == selected?.name ? "w-10 h-10 rounded-full ring-4 ring-fuchsia-500 cursor-pointer" : "w-10 h-10 rounded-full cursor-pointer"}/>
                                                        </label>
                                                        <input type="radio"
                                                               {...register("image", )}
                                                               id={img.name + "-s"}
                                                               value={img.name}
                                                               style={{visibility: "hidden"}}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-row gap-5 justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowModal(false)
                                                }
                                                className="bg-transparent text-fuchsia-950 border hover:border-fuchsia-950 border-white py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.changeProfileImageModal.cancel"
                                                )}
                                            </button>
                                            <button
                                                type="submit"
                                                className="hover:text-white text-fuchsia-950 hover:bg-fuchsia-950 bg-slate-200 py-2 px-4 rounded-full"
                                            >
                                                {t(
                                                    "components.changeProfileImageModal.change"
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

export default ChangeProfileImageModal;
