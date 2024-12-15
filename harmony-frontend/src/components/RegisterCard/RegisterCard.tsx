import { useForm } from "react-hook-form";
import { UserService } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const RegisterCard = () => {
    type FormData = {
        mail: string;
        password: string;
        name: string;
        lastname: string;
        terms: boolean;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        getValues,
    } = useForm<FormData>();

    watch("password");
    watch("lastname");
    watch("name");

    const nav = useNavigate();
    const { t } = useTranslation();

    const submitRegister = async (data: any) => {
        const fullname = data.name + " " + data.lastname;
        const rsp = await UserService.signUpWithUserAndPassword(
            fullname,
            data.mail,
            data.password
        );
        let login = null;
        if (rsp?.status == 200)
            login = await UserService.signInWithUserAndPassword(
                data.mail,
                data.password
            );
        if (login?.status == 200) {
            let authJson = await login?.json()
            localStorage['harmony-jwt'] = authJson.access_token
            localStorage['harmony-uid'] = authJson.person.id
            localStorage['harmony-profile-image'] = authJson.person.image
            window.dispatchEvent(new Event("harmony"));
            window.dispatchEvent(new Event("harmony-pi"))
            nav("/", {replace: true})
        }
    };

    const invalidEmail = (email: string) => {
        if (email.length === 0) return false;
        return !!String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return (
        <div>
            <div className="text-fuchsia-950 text-4xl mt-1 mb-4">
                {t("pages.register.title")}
            </div>
            <form
                onSubmit={handleSubmit(submitRegister)}
                className="bg-white rounded px-8 pt-6"
            >
                <div className="my-6 grid gap-6 grid-cols-2">
                    <div>
                        <label
                            className="block text-fuchsia-950 text-base mb-2"
                            htmlFor="name"
                        >
                            {t("pages.register.firstName")}
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register("name", {
                                required: true,
                                maxLength: 100,
                                pattern: {
                                    value: /^[a-zA-z\s'-]+|^$/,
                                    message: "",
                                },
                            })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Freddie"
                        />
                        {errors.name && (
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">
                                {t("pages.register.error.firstName")}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            className="block text-fuchsia-950 text-base mb-2"
                            htmlFor="lastname"
                        >
                            {t("pages.register.lastName")}
                        </label>
                        <input
                            id="lastname"
                            type="text"
                            {...register("lastname", {
                                required: true,
                                maxLength: 100,
                                pattern: {
                                    value: /^[a-zA-z\s'-]+|^$/,
                                    message: "",
                                },
                            })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Mercury"
                        />
                        {errors.lastname && (
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">
                                {t("pages.register.error.lastName")}
                            </p>
                        )}
                    </div>
                </div>
                <div className="my-6">
                    <label
                        className="block text-fuchsia-950 text-base mb-2"
                        htmlFor="mail-register"
                    >
                        {t("pages.register.mail")}
                    </label>
                    <input
                        id="mail-register"
                        type="mail"
                        {...register("mail", {
                            required: true,
                            validate: { invalidEmail },
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="freddie@mercury.com"
                    />
                    {errors.mail && (
                        <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">
                            {t("pages.register.error.mail")}
                        </p>
                    )}
                </div>
                <div className="my-6">
                    <label
                        className="block text-fuchsia-950 text-base mb-2"
                        htmlFor="pass-register"
                    >
                        {t("pages.register.password")}
                    </label>
                    <input
                        id="pass-register"
                        type="password"
                        {...register("password", {
                            required: true,
                            minLength: 8,
                        })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <p className="text-xs text-gray-400">
                        {t("pages.register.error.passwordLength")}
                    </p>
                    {errors.password && (
                        <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">
                            {t("pages.register.error.password")}
                        </p>
                    )}
                </div>
                {errors.terms && (
                    <p className="block mb-2 text-xs font-medium text-red-700 margin-top: 1.25rem">
                        {t("pages.register.error.subscription")}
                    </p>
                )}
                <button
                    type="submit"
                    className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-2"
                >
                    {t("pages.register.submit")}
                </button>
            </form>
        </div>
    );
};

export default RegisterCard;
