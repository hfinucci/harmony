import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import { FaRegBell } from "react-icons/fa";

export const Navbar = () => {
    const { t } = useTranslation();



    return (
        <nav
            className="w-full pr-2 sm:px-4 py-2.5 fixed shadow-md rounded z-10"
            style={{ backgroundColor: "#F9F5FF" }}
        >
            <div className="flex flex-wrap justify-between mx-auto">
                <Link to={localStorage.getItem("harmony-jwt") ==  null? "/" : "/home"} className="flex items-center">
                    <img src={logo} alt="logo" className={"mr-3 h-9"} />
                    <h1>Harmony</h1>
                </Link>
                <div
                    className="hidden w-full md:block md:w-auto"
                    id="navbar-default"
                >
                    {!localStorage.getItem("harmony-jwt") &&
                        <ul className="flex flex-col p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                            <li>
                                <Link to="/login">
                                    <h1 className="bg-white text-fuchsia-950 hover:bg-fuchsia-950 hover:text-white border border-fuchsia-950 py-2 px-4 rounded-full">
                                        {t("components.navbar.login")}
                                    </h1>
                                </Link>
                            </li>
                            <li>
                                <Link to="/register">
                                    <h1 className="hover:bg-white hover:text-fuchsia-950 text-white border border-fuchsia-950 bg-fuchsia-950 py-2 px-4 rounded-full">
                                        {t("components.navbar.register")}
                                    </h1>
                                </Link>
                            </li>
                        </ul>
                    }
                    {localStorage.getItem("harmony-jwt") &&
                        <ul className="flex flex-col content-center p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                            <li className="text-fuchsia-950 text-3xl self-center">
                                <FaRegBell />
                            </li>
                            <li>
                                <img className="w-10 h-10 rounded-full self-center" src={localStorage.getItem('harmony-profile-image')}
                                     alt="Rounded avatar" />
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
