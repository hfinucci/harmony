
// import { Piano } from 'react-nexusui';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Navbar from './components/Navbar/Navbar';
import SessionPage from './pages/SessionPage/SesionPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className='pt-24'>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/session" element={<SessionPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
