import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import { FaRegBell } from "react-icons/fa";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { t } = useTranslation();

    const nav = useNavigate();
    const [image, setImage] = useState<string>(localStorage.getItem("harmony-profile-image")? localStorage.getItem("harmony-profile-image") : null)

    window.addEventListener('harmony-pi', () => {
        setImage(localStorage.getItem("harmony-profile-image"))
    })

    const logOut = () => {
        localStorage.removeItem("harmony-jwt")
        localStorage.removeItem("harmony-uid")
        localStorage.removeItem("harmony-profile-image")

        window.dispatchEvent(new Event("harmony"))
        window.dispatchEvent(new Event("harmony-pi"))
        nav("/", {replace: true})
    }

    return (
        <nav
            className="w-full pr-2 sm:px-4 py-2.5 fixed shadow-md rounded z-20"
            style={{ backgroundColor: "#F9F5FF" }}
        >
            <div className="flex flex-wrap justify-between mx-auto">
                <Link to="/" className="flex items-center">
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
                    {image &&
                        <ul className="flex flex-col content-center p-4 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                            <li className="text-fuchsia-950 text-3xl self-center">
                                <FaRegBell />
                            </li>
                            <li>
                                <img id="avatarButton" data-dropdown-toggle="userDropdown"
                                     data-dropdown-placement="bottom-start"
                                     className="w-10 h-10 rounded-full cursor-pointer"
                                     src={image} alt="Profile Image" />

                                    <div id="userDropdown"
                                         className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                                        <ul className="py-2 text-sm text-fuchsia-950"
                                            aria-labelledby="avatarButton">
                                            <li>
                                                <Link to="/configuration"
                                                   className="block px-4 py-2 hover:bg-gray-100">{ t("components.navbar.userMenu.configuration") }</Link>
                                            </li>
                                        </ul>
                                        <div className="block py-1">
                                            <button onClick={logOut}
                                               className="block py-2 pl-4 w-full text-left text-sm text-fuchsia-950 hover:bg-gray-100">{ t("components.navbar.userMenu.logout") }</button>
                                        </div>
                                    </div>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
