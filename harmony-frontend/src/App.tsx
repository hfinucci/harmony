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
import PianoPage from "./pages/PianoPage/PianoPage.tsx";

export const BASE_URL = "http://127.0.0.1:3000";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="pt-24 bg-gradient-to-b from-purple-300 to-white">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route
                        path="/configuration"
                        element={<ConfigurationPage />}
                    />
                    <Route
                        path="/songs"
                        element={<SongsPage />}
                    />
                    <Route path="/orgs/:id" element={<OrgPage />} />
                    <Route path="/orgs" element={<OrgsPage />} />
                    <Route path="/piano" element={<PianoPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
