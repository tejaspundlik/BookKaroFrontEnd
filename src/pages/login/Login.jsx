import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import Navbar from "../../components/navbar/Navbar";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [err, setErr] = useState(null);
  const { loading, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleForgot = () => {
    navigate("/forgot");
  }

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(credentials.email, credentials.password)
    if (credentials.email.trim() === '' || credentials.password.trim() === '') {
      setErr("Error, please fill each field")
    }
    else if (!isValidEmail(credentials.email)) {
      setErr("Error, please put email in the correct format")
    }
    else {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axios.post("https://bookkaro.onrender.com/auth/login", credentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/")
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        setErr(err.response.data.message)
      }
    }
  };

  return (
    <div>
      <Navbar />
      {err && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="error" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {err}
          </Alert>
        </Stack>
      )}
      <div className="Logincontainer">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">

          <TextField
            type="mail"
            label="Email"
            variant="outlined"
            id="email"
            onChange={handleChange}
            value={credentials.email}
            className="textinput"
          />



          <TextField
            type="password"
            label="Password"
            variant="outlined"
            id="password"
            onChange={handleChange}
            value={credentials.password}
            className="textinput"
          />


          <div className="submit-container">
            <button disabled={loading} onClick={handleClick} className="submit">
              Login
            </button>
            <div className="forgotDiv">
              <div className="link" onClick={handleForgot}>Forgot Password?</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Login;
