import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import ConfigurationPage from "./pages/ConfigurationPage/ConfigurationPage";
import OrgPage from "./pages/OrgPage/OrgPage";
import SongsPage from "./pages/SongsPage/SongsPage.tsx";
import OrgsPage from "./pages/OrgsPage/OrgsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import EditPage from "./pages/EditPage/EditPage";
import { useState } from "react";
import InvitationPage from "./pages/InvitationPage/InvitationPage.tsx";

export const BASE_URL = "http://127.0.0.1:3000";

function App() {

    const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("harmony-jwt"))

    window.addEventListener('harmony', () => {
        setAuth(!!localStorage.getItem("harmony-jwt"))
    })

    return (
        <BrowserRouter>
            <Navbar />
            <div className="pt-24 bg-gradient-to-b from-purple-300 to-white">
                <Routes>
                    <Route path="/" element={auth? <HomePage /> : <LandingPage/>}/>
                    {!auth &&
                        <Route path="/register" element={<RegisterPage/>}/>
                    }
                    {!auth &&
                        <Route path="/login" element={<LoginPage/>}/>
                    }

                    {auth &&
                        <Route
                            path="/configuration"
                            element={<ConfigurationPage/>}
                        />
                    }
                    {auth &&
                        <Route
                            path="/songs"
                            element={<SongsPage/>}
                        />
                    }
                    {auth &&
                        <Route path="/songs/:id" element={<EditPage/>}/>
                    }
                    {auth &&
                        <Route path="/orgs/:id" element={<OrgPage/>}/>
                    }
                    {auth &&
                        <Route path="/orgs" element={<OrgsPage/>}/>
                    }
                    <Route path="/accept-invitation" element={<InvitationPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
