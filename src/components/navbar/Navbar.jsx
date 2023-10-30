import "./navbar.css"
import {Link} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {  useNavigate } from "react-router-dom";
import {useState} from "react";


const Navbar = () => {
    const {user} = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate()

    const handleRegister = () => {
        if(!user){
            navigate("/register")
        }
    }

    const handleClick = () => {
        if(user){
            setOpenModal(true)
        } else {
            navigate("/login")
        }
    };

    const logOut = () => {
        setOpenModal(false)
        localStorage.removeItem('user')
        document.location.reload(true)
    }

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className="frame">

            <a href="/" onClick={handleLogoClick} className="logo-link">
                <div className="div">
                <div className="overlap-group">
                    <div className="rectangle" />
                    <div className="text-wrapper">Karo</div>
                </div>
                <div className="text-wrapper-2">Book</div>
                </div>
            </a>

            {user ? <button className="div-wrapper" onClick={logOut}><div className="text-wrapper-4">Log Out {user.username}</div></button> : (
                <div className="div-2">
                    <button className="div-wrapper" onClick={handleRegister}><div className="text-wrapper-4">Register</div></button>
                    <button className="div-wrapper" onClick={handleClick}><div className="text-wrapper-4">Login</div></button>
                </div>
            )}
        </div>
    )
}
export default Navbar