import {useForm} from "react-hook-form";

export const LoginCard = () => {

    type FormData = {
        mail: string;
        password: string;
        name: string;
        lastname: string;
        remember: boolean;
    };

    const {
        register, 
        handleSubmit, 
        watch, 
        formState: {errors}
    } = useForm<FormData>();

    watch("password")
    watch("lastname")
    watch("name")

    const submitLogin =  (data: any) => {
        console.log(data.mail);
        console.log(data.password);
        console.log(data.remember);
    }

    const invalidEmail = (email: String) => {
        if (email.length === 0)
            return false
        return !!String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    return (
        <div>
            <div className="text-fuchsia-950 text-4xl mt-1 mb-4">Iniciar Sesión</div>
                <form onSubmit={handleSubmit(submitLogin)} className="bg-white rounded px-8 pt-6 pb-8 mt-14 felx">
                    <div className="my-6">
                        <label className="block text-fuchsia-950 text-base mb-2" 
                                htmlFor="mail-login">
                            Dirección de Correo
                        </label>
                        <input id="mail-login" 
                                type="mail" 
                                {...register("mail", {required: true, validate: {invalidEmail}})}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="freddie@mercury.com"/>
                        {errors.mail &&
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">Error mail</p>
                        }
                    </div>
                    <div className="my-6">
                        <label className="block text-fuchsia-950 text-base mb-2" 
                                htmlFor="password-login">
                            Contraseña
                        </label>
                        <input id="password-login" 
                                type="password"
                                {...register("password", {required: true, minLength:8})}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        <p className="text-xs text-gray-400">¿Te olvidaste la contraseña?</p>
                        {errors.password &&
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">Error contraseña</p>
                        }
                    </div>
                    <div className="flex items-center my-6">
                        <input id="remember" 
                                type="checkbox" 
                                {...register("remember")}
                                className="w-4 h-4 text-fuchsia-950 bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-950 focus:ring-2"/>
                        <label htmlFor="remember" 
                                className="ml-2 text-sm text-gray-400">
                            Recordarme
                        </label>
                    </div>
                    <button type="submit" className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-3 mb-4">INICIAR SESIÓN</button>
                </form>
            </div>
    )
}

export default LoginCard