import {useForm} from "react-hook-form";

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
        formState: {errors},
        getValues
    } = useForm<FormData>();

    watch("password")
    watch("lastname")
    watch("name")

    const validateTerms = () => {
        return getValues("terms") == true;
    };

    const submitRegister = (data: any) => {
        console.log(data.name);
        console.log(data.lastname);
        console.log(data.mail);
        console.log(data.password);
        console.log(data.terms);
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
            <div className="text-fuchsia-950 text-4xl mt-1 mb-4">Registrarse</div>
            <form onSubmit={handleSubmit(submitRegister)} className="bg-white rounded px-8 pt-6">
                <div className="my-6 grid gap-6 grid-cols-2">
                    <div>
                        <label className="block text-fuchsia-950 text-base mb-2" 
                                htmlFor="name">
                            Nombre
                        </label>
                        <input id="name"
                                type="text"
                                {...register("name", {required: true, maxLength: 100,  pattern:{value: /^[a-zA-z\s'-]+|^$/, message:""}})}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                                placeholder="Freddie"/>
                        {errors.name &&
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">Error en nombre</p>
                        }
                    </div>
                    <div>
                        <label className="block text-fuchsia-950 text-base mb-2" 
                                htmlFor="lastname">
                            Apellido
                        </label>
                        <input id="lastname"
                                type="text"
                                {...register("lastname", {required: true, maxLength: 100,  pattern:{value: /^[a-zA-z\s'-]+|^$/, message:""}})}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                placeholder="Mercury"/>
                        {errors.lastname &&
                            <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">Error en apellido</p>
                        }
                    </div>
                </div>
                <div className="my-6">
                    <label className="block text-fuchsia-950 text-base mb-2" 
                            htmlFor="mail-register">
                        Dirección de Correo
                    </label>
                    <input id="mail-register" 
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
                            htmlFor="pass-register">
                        Contraseña
                    </label>
                    <input id="pass-register" 
                            type="password"
                            {...register("password", {required: true, minLength:8})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                    <p className="text-xs text-gray-400">Mínimo 8 caracteres</p>
                    {errors.password &&
                        <p className="block mb-2 text-sm font-medium text-red-700 margin-top: 1.25rem">Error contraseña</p>
                    }
                </div>
                <div className="flex items-center my-6">
                    <input id="terms" 
                            type="checkbox" 
                            {...register("terms", {required: true, validate:validateTerms})}
                            className="w-4 h-4 text-fuchsia-950 bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-950 focus:ring-2"/>
                    <label htmlFor="terms" 
                            className="ml-2 text-sm text-gray-400">
                        Al subscribirme, acepto los Terminos de Servicio y la Política de Privacidad
                    </label>
                </div>
                {errors.terms &&
                    <p className="block mb-2 text-xs font-medium text-red-700 margin-top: 1.25rem">Debes aceptar los Terminos y Condiciones</p>
                }
                <button type="submit" 
                        className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-2">REGISTRATE</button>
            </form>
        </div>
    )

}

export default RegisterCard