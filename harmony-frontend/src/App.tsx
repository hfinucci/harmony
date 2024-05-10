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

export const BASE_URL = "http://127.0.0.1:3000";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="pt-24 bg-gradient-to-b from-purple-300 to-white">
                <Routes>
                    <Route path="/" element={localStorage.getItem("harmony-uid") == null? <LandingPage /> : <HomePage />} />
                    {!localStorage.getItem("harmony-uid") &&
                        <Route path="/register" element={<RegisterPage/>}/>
                    }
                    {!localStorage.getItem("harmony-uid") &&
                        <Route path="/login" element={<LoginPage/>}/>
                    }
                    {localStorage.getItem("harmony-uid") &&
                        <Route
                            path="/configuration"
                            element={<ConfigurationPage/>}
                        />
                    }
                    {localStorage.getItem("harmony-uid") &&
                        <Route
                            path="/songs"
                            element={<SongsPage/>}
                        />
                    }
                    {localStorage.getItem("harmony-uid") &&
                        <Route path="/songs/:id" element={<EditPage/>}/>
                    }
                    {localStorage.getItem("harmony-uid") &&
                        <Route path="/orgs/:id" element={<OrgPage/>}/>
                    }
                    {localStorage.getItem("harmony-uid") &&
                        <Route path="/orgs" element={<OrgsPage/>}/>
                    }
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
