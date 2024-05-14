import { useForm } from "react-hook-form";
import { UserService } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const LoginCard = () => {
    type FormData = {
        mail: string;
        password: string;
        remember: boolean;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    watch();

    const nav = useNavigate();
    const { t } = useTranslation();

    const [loginError, setLoginError]: any = useState();

    const submitLogin =  async (data: any) => {
        const login = await UserService.signInWithUserAndPassword(
            data.mail,
            data.password
        );
        if(login?.status == 200) {
            console.log("es 200")
            let authJson = await login?.json()
            if (authJson.access_token === undefined || authJson.person?.id === undefined) {
                setLoginError("Invalid login credentials")
                return
            }
            localStorage['harmony-jwt'] = authJson.access_token
            localStorage['harmony-uid'] = authJson.person.id
            localStorage['harmony-profile-image'] = authJson.person.image
            window.dispatchEvent(new Event("harmony"));
            window.dispatchEvent(new Event("harmony-pi"))
            nav("/", {replace: true})
        }
        else setLoginError(t("pages.login.error.credentials"));
    }

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
            <div className="text-fuchsia-950 text-4xl mt-1 mb-4 justify-self-start">
                {t("pages.login.title")}
            </div>
            <div  className="flex flex-col items-center">
                <form
                    onSubmit={handleSubmit(submitLogin)}
                    className="bg-white rounded px-8 pt-6 pb-8 w-4/5 "
                >
                    <div className="my-6">
                        <label
                            className="block text-fuchsia-950 text-base mb-2"
                            htmlFor="mail-login"
                        >
                            {t("pages.login.mail")}
                        </label>
                        <input
                            id="mail-login"
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
                                {t("pages.login.error.mail")}
                            </p>
                        )}
                    </div>
                    <div className="my-6">
                        <label
                            className="block text-fuchsia-950 text-base mb-2"
                            htmlFor="password-login"
                        >
                            {t("pages.login.password")}
                        </label>
                        <input
                            id="password-login"
                            type="password"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                            })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <p className="text-xs text-gray-400">
                            {t("pages.login.forget")}
                        </p>
                        {errors.password && (
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">
                                {t("pages.login.error.password")}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center my-6">
                        <input
                            id="remember"
                            type="checkbox"
                            {...register("remember")}
                            className="w-4 h-4 text-fuchsia-950 bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-950 focus:ring-2"
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 text-sm text-gray-400"
                        >
                            {t("pages.login.remember")}
                        </label>
                    </div>
                    <p className="text-red-500 text-xs col-span-5 col-start-2 mt-2">
                        {loginError}
                    </p>
                    <button
                        type="submit"
                        className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-3 mb-4"
                    >
                        {t("pages.login.submit")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginCard;
