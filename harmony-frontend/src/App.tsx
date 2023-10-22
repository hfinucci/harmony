
// import { Piano } from 'react-nexusui';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage/LandingPage';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
        <Navbar/>
      <div className='pt-16'>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
        </Routes>
      </div>
  
    </BrowserRouter>
  )
}

export default App
