import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const ErrorPage = ({code = 404, msg}: {code?: number, msg?: string}) => {
    const { t } = useTranslation();

    typeof msg === "undefined" && (msg = "pages.error.default");

    return (
        <div className="flex flex-col justify-center text-center items-center h-screen -mt-20">
            <h1 className="text-fuchsia-950 text-7xl mb-28">Error {code}</h1>
            <h2 className="text-fuchsia-800 text-3xl mb-8">{t(msg)}</h2>
            <Link to="/" className="text-fuchsia-800 text-xl underline">{t("pages.error.goToHome")}</Link>
        </div>
    )
};

export default ErrorPage;