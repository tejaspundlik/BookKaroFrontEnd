import React from "react";
import "./forgot.css";
import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [err, setErr] = useState(null);
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const phonePattern = /^[0-9]{10}$/;

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handlePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (!emailPattern.test(email)) {
            setErr("Please enter a valid email address");
        } else if (password === '') {
            setErr("Password Field Is Blank");
        } else if (!phonePattern.test(phone)) {
            setErr("Phone Number Is Not Of Length 10");
        } else {
            try {
                const newUser = {
                    email,
                    phone,
                    password
                };
                await axios.post("https://bookkaro.onrender.com/auth/reset", newUser);
                window.location.assign("/login");
            } catch (err) {
                console.log(err);
                setErr(err.response.data.message);
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
            <div className="container">
                <div className="header">
                    <div className="text">Change Password</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">

                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        onChange={handleEmail}
                        value={email}
                        placeholder="Email"
                        id="email"
                    />


                    <TextField
                        type="text"
                        label="Mobile Number"
                        variant="outlined"
                        onChange={handlePhone}
                        value={phone}
                        placeholder="Mobile Number"
                        id="phone"
                    />


                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        onChange={handlePassword}
                        value={password}
                        placeholder="Password"
                        id="password"
                    />

                </div>

                <div className="submit-container">
                    <button className="submit" type="submit" onClick={handleClick}>Change</button>
                </div>
            </div>
        </div>
    );
}

export default Forgot;
