import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import List from "./pages/hotelsList/List.jsx";
import Hotel from "./pages/eachHotel/Hotel.jsx"
import Login from './pages/login/Login';
import Register from "./pages/register/Register.jsx";
import Forgot from "./pages/forgot_pass/Forgot.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot" element={<Forgot/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
