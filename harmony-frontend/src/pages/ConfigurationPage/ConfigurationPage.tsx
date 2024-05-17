import DeleteAccountModal from "../../components/DeleteAccountModal/DeleteAccountModal";
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal";
import SupportedLanguages from "../../types/enums/SupportedLanguages";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";
import { ChangeEvent } from "react";
import ChangeProfileImageModal from "../../components/ChangeProfileImageModal/ChangeProfileImageModal";

const ConfigurationPage = () => {
    const { t } = useTranslation();
    const languagesList = Object.entries(SupportedLanguages).map(
        ([key, value]) => ({
            value: value,
            label: key,
        })
    );

    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value as string);
    };

    return (
        <div className="container h-screen mt-16 mx-auto max-w-4xl">
            <h1 className="text-fuchsia-950 text-4xl mb-4">
                {t("pages.configuration.title")}
            </h1>
            <div className="flex flex-col rounded-lg bg-white p-10">
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">
                        {t("pages.configuration.language")}
                    </div>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-500 block"
                        onChange={handleLanguageChange}
                        value={i18n.resolvedLanguage}
                    >
                        {languagesList.map((language) => (
                            <option key={language.value} value={language.value}>
                                {language.label}
                            </option>
                        ))}
                    </select>
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0" />
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">
                        {t("pages.configuration.changePassword")}
                    </div>
                    <ChangePasswordModal />
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0" />
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">
                        {t("pages.configuration.changeImage")}
                    </div>
                    <ChangeProfileImageModal />
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0" />
                <div className="flex flex-row justify-between">
                    <div className="text-slate-400">
                        {t("pages.configuration.deleteAccount")}
                    </div>
                    <DeleteAccountModal />
                </div>
            </div>
        </div>
    );
};

export default ConfigurationPage;
