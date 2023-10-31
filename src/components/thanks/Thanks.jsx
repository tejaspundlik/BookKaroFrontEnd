import "./thanks.css";
import React, { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiCheckCircleOutline } from '@mdi/js';



const Thanks = () =>{

    const navigate = useNavigate()

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigate("/");
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [navigate]);

    return (
        <div className="thanksContainer">
            <div className="thanksDiv">
                <Icon path={mdiCheckCircleOutline} size={3} />
                <h1>Thank You! Your Booking is Successful</h1>
                <h2>Enjoy your stay at this hotel</h2>      
            </div>
        </div>
    )
}

export default Thanks;