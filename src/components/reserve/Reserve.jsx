import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const Reserve = ({ setOpen, hotelId, price }) => {
    const [selectedRooms, setSelectedRooms] = useState([]);
    const { data, loading, error } = useFetch(`https://bookkaro.onrender.com/hotels/room/${hotelId}`);
    const { dates } = useContext(SearchContext);
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');
    const [showPayment, setPayment] = useState(false)
    const startDate = new Date(storedStartDate);
    const endDate = new Date(storedEndDate);

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const date = new Date(start.getTime());

        const dates = [];

        while (date <= end) {
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };
    const alldates = getDatesInRange(startDate, endDate);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some(date =>
            alldates.includes(new Date(date).getTime())
        );

        return !isFound
    }

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(
            checked
                ? [...selectedRooms, value]
                : selectedRooms.filter((item) => item !== value)
        );
    };

    const navigate = useNavigate()

    const afterPayment = () => {
        navigate('/thanks')
    }
    const handleClick = async () => {
        try {
            await Promise.all(
                selectedRooms.map(roomId => {
                    const res = axios.put(`https://bookkaro.onrender.com/rooms/availability/${roomId}`, {
                        dates: alldates,
                    });
                    return res.data;
                })
            );
            setPayment(true)
        } catch (err) {

        }
    }




    return (
        <PayPalScriptProvider options={{ "client-id": "AUviz0J32U7rwFdr-JaqKW5nTaNQxzixE78MUA7VxJd3CnDq9ofS0GpBwBtUWqfMHHeKm7MfgeG6B46q" }}>
            <div className="reserve">
                <div className="rContainer">
                    <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="rClose"
                        onClick={() => setOpen(false)}
                    />
                    <h3>Select your rooms:</h3>
                    {data.map((item) => (
                        <div className="rItem" key={item._id}>
                            <div className="rItemInfo">
                                <div className="rTitle">{item.title}</div>
                                <div className="rDesc">{item.desc}</div>
                            </div>
                            <div className="rSelectRooms">
                                {item.roomNumbers.map((roomNumber) => (
                                    <div className="room">
                                        <label>{roomNumber.number}</label>
                                        <input
                                            type="checkbox"
                                            value={roomNumber._id}
                                            onChange={handleSelect}
                                            disabled={!isAvailable(roomNumber)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {!showPayment &&
                        <button className="rButton" onClick={handleClick}>
                            Reserve Now!
                        </button>
                    }
                    {showPayment && (
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: price, // Replace with the total amount
                                                currency_code: "USD", // Currency code
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then(function (details) {
                                    afterPayment()
                                });
                            }}
                            onError={(err) => {
                                alert("Your Browser Is Blocking The Payment PopUp")
                            }}
                        />
                    )}
                </div>
            </div>
        </PayPalScriptProvider>
    );
};


export default Reserve
