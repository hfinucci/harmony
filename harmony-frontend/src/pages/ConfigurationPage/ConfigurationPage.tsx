import DeleteAccountModal from "../../components/DeleteAccountModal/DeleteAccountModal";
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal";

const ConfigurationPage = () => {
    return (
        <div className="container h-screen mt-16 mx-auto max-w-4xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4">Configuración</h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">Idioma</div>
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block">
                        <option value="ES">Español</option>
                        <option value="EN">Inglés</option>
                    </select>
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0" />
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">Cambiar la contraseña</div>
                    <ChangePasswordModal />
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0" />
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">Eliminar cuenta</div>
                    <DeleteAccountModal />
                </div>
            </div>
        </div>
    );
};

export default ConfigurationPage;
