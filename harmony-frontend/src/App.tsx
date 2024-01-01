// import { Piano } from 'react-nexusui';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import SessionPage from "./pages/SessionPage/SesionPage";
import HomePage from "./pages/HomePage/HomePage";
import ConfigurationPage from "./pages/ConfigurationPage/ConfigurationPage";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="pt-24 bg-gradient-to-b from-purple-300 to-white">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/session" element={<SessionPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route
                        path="/configuration"
                        element={<ConfigurationPage />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
