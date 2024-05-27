import { useTranslation } from "react-i18next";
import guitarists from "../../assets/landing-guitarists.png";
import jazzband from "../../assets/landing-jazz-band.png";
import musicroom from "../../assets/landing-music-room.png";
import rockband from "../../assets/landing-rock-band.png";
import {Link} from "react-router-dom";

const LandingPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6"></div>
                <div className="flex flex-row items-center justify-between pt-32 pb-12 px-12">
                    <img
                        src={guitarists}
                        className="max-w-md max-h-md"
                        alt={t("pages.landingPage.guitarists")}
                    />
                    <div className="flex flex-col">
                        <h1 className="text-7xl font-serif font-bold text-fuchsia-950">
                            Harmony
                        </h1>
                        <h2 className="text-4xl font-serif font-medium text-zinc-600 mb-2">
                            {t("pages.landingPage.collaboration.title")}
                        </h2>
                        <p className="text-xl font-serif text-zinc-500">
                            {t("pages.landingPage.collaboration.description")}
                        </p>
                    </div>
                </div>
            </section>
            <section className="relative">
                <h1 className="text-center text-5xl font-serif font-bold text-fuchsia-950 pb-12">
                    {t("pages.landingPage.offer.title")}
                </h1>
                <div className="grid grid-cols-3 gap-2 px-12 justify-center text-center">
                    <div className="grid grid-rows-2 grid-flow-col">
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                {t(
                                    "pages.landingPage.offer.collaboration.title"
                                )}
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                {t(
                                    "pages.landingPage.offer.collaboration.description"
                                )}
                            </p>
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                {t("pages.landingPage.offer.realtime.title")}
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                {t(
                                    "pages.landingPage.offer.realtime.description"
                                )}
                            </p>
                        </div>
                    </div>
                    <img
                        src={jazzband}
                        className="max-w-md max-h-md"
                        alt={t("pages.landingPage.jazzband")}
                    />
                    <div className="grid grid-rows-2 grid-flow-col">
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                {t("pages.landingPage.offer.remote.title")}
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                {t(
                                    "pages.landingPage.offer.remote.description"
                                )}
                            </p>
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-semibold text-fuchsia-900">
                                {t("pages.landingPage.offer.tools.title")}
                            </h1>
                            <p className="text-xl font-serif text-zinc-500">
                                {t("pages.landingPage.offer.tools.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative px-12 pt-12 pb-6">
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col justify-around">
                        <h1 className="text-5xl font-serif font-bold text-fuchsia-950 pb-4">
                            {t("pages.landingPage.steps.title")}
                        </h1>
                        <p className="text-2xl font-serif text-zinc-500 indent-16">
                            {t("pages.landingPage.steps.create")}
                        </p>
                        <p className="text-2xl font-serif text-zinc-500 indent-32">
                            {t("pages.landingPage.steps.invite")}
                        </p>
                        <p className="text-2xl font-serif text-zinc-500 indent-60">
                            {t("pages.landingPage.steps.compose")}
                        </p>
                        <p className="text-2xl font-serif text-zinc-500 indent-80">
                            {t("pages.landingPage.steps.improve")}
                        </p>
                        <h2 className="text-4xl font-serif font-bold text-fuchsia-950 indent-96">
                            {t("pages.landingPage.steps.easy")}
                        </h2>
                    </div>
                    <img
                        src={musicroom}
                        className="max-w-sm max-h-sm"
                        alt={t("pages.landingPage.listening")}
                    />
                </div>
            </section>
            <section className="relative">
                <div className="flex flex-row pb-12">
                    <img
                        src={rockband}
                        className="max-w-md max-h-md"
                        alt={t("pages.landingPage.rockband")}
                    />
                    <div className="flex flex-col justify-evenly text-center">
                        <h1 className="text-5xl font-serif font-bold text-fuchsia-950">
                            {t("pages.landingPage.join.title")}
                        </h1>
                        <p className="text-xl font-serif text-zinc-500 px-12">
                            {t("pages.landingPage.join.description")}
                        </p>
                        <div className="flex justify-center">
                            <Link to="/register">
                                <h1 className="hover:bg-white hover:text-fuchsia-950 text-white border border-fuchsia-950 bg-fuchsia-950 py-2 px-4 rounded-full w-fit">
                                    {t("pages.landingPage.join.signUp")}
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;
