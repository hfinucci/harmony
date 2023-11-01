const SessionPage = () => {
    return (
        <div className="grid gap-6 grid-cols-2 flex flex-wrap">
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 flex flex-col justify-between h-fit">
                <div>
                    <div className="text-fuchsia-950 text-4xl mt-1 mb-4">Registrarse</div>
                    <form className="bg-white rounded px-8 pt-6">
                        <div className="my-6 grid gap-6 grid-cols-2">
                            <div>
                                <label className="block text-fuchsia-950 text-base mb-2" htmlFor="name">
                                    Nombre
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Freddie"/>
                            </div>
                            <div>
                                <label className="block text-fuchsia-950 text-base mb-2" htmlFor="lastname">
                                    Apellido
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastname" type="text" placeholder="Mercury"/>
                            </div>
                        </div>
                        <div className="my-6">
                            <label className="block text-fuchsia-950 text-base mb-2" htmlFor="mail-register">
                                Dirección de Correo
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mail-register" type="text" placeholder="freddie@mercury.com"/>
                        </div>
                        <div className="my-6">
                            <label className="block text-fuchsia-950 text-base mb-2" htmlFor="pass-register">
                                Contraseña
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pass-register" type="password"/>
                            <p className="text-xs text-gray-400">Mínimo 8 caracteres</p>
                        </div>
                        <div className="flex items-center my-6">
                            <input id="default-checkbox" type="checkbox" className="w-4 h-4 text-fuchsia-950 bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-950 focus:ring-2"/>
                            <label htmlFor="default-checkbox" className="ml-2 text-sm text-gray-400">Al subscribirme, acepto los Terminos de Servicio y la Política de Privacidad </label>
                        </div>
                        <button type="button" className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-2">REGISTRATE</button>
                    </form>
                </div>
            </div>
            <div className="mt-6 ml-6 shadow-md rounded-lg bg-white p-4 flex flex-col justify-between h-fit">
                <div>
                    <div className="text-fuchsia-950 text-4xl mt-1 mb-4">Iniciar Sesión</div>
                    <form className="bg-white rounded px-8 pt-6 pb-8 mt-14 felx">
                        <div className="my-6">
                            <label className="block text-fuchsia-950 text-base mb-2" htmlFor="mail-login">
                                Dirección de Correo
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="mail-login" type="text" placeholder="freddie@mercury.com"/>
                        </div>
                        <div className="my-6">
                            <label className="block text-fuchsia-950 text-base mb-2" htmlFor="password-login">
                                Contraseña
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password-login" type="password"/>
                            <p className="text-xs text-gray-400">¿Te olvidaste la contraseña?</p>
                        </div>
                        <div className="flex items-center my-6">
                            <input id="default-checkbox" type="checkbox" className="w-4 h-4 text-fuchsia-950 bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-950 focus:ring-2"/>
                            <label htmlFor="default-checkbox" className="ml-2 text-sm text-gray-400">Recordarme</label>
                        </div>
                        <button type="button" className="text-fuchsia-950 hover:text-white border border-fuchsia-950 hover:bg-fuchsia-950 focus:ring-4 focus:outline-none focus:ring-fuchsia-950 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mt-3 mb-4">INICIAR SESIÓN</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SessionPage;