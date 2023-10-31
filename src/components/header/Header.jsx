import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import image2 from '../images/hotel_2.2.jpg';
import image1 from '../images/hotel_1.1.jpg';
import image3 from '../images/hotel_3.3.jpg';
import image4 from '../images/hotel_4.4.jpg';

const Header = ({ type }) => {
    const [destination, setDestination] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    ]);

    const [openDate, setOpenDate] = useState(false);
    const [openOptions, setOpenOptions] = useState(false); // Separate state for Options
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });

    const images = [
        `url('${image1}') no-repeat`,
        `url('${image2}') no-repeat`,
        `url('${image3}') no-repeat`,
        `url('${image4}') no-repeat`,
    ];

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            };
        });
    };

    const { dispatch } = useContext(SearchContext);

    const handleSearch = () => {
        const endDate = dates[0].endDate;
        const endMonth = endDate.getMonth()

        localStorage.setItem('startDate', dates[0].startDate.toISOString());
        localStorage.setItem('endDate', dates[0].endDate.toISOString());
        localStorage.setItem('optionsRoom', options.room);
        localStorage.setItem('endMonth', endMonth);
        dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
        navigate("/hotels", { state: { destination, dates, options } });
    };

    useEffect(() => {
        const imageSlideshowInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            const headerContainer = document.querySelector(".headerContainer");
            headerContainer.classList.toggle("sliding-animation");
        }, 3000);

        return () => {
            clearInterval(imageSlideshowInterval);
        };
    }, [images]);

    const closeDateRange = () => {
        setOpenDate(false);
    };

    const closeOptions = () => {
        setOpenOptions(false);
    };

    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}
                style={type !== "list" ? { background: images[currentImageIndex] } : {}}>
                {type !== "list" && (
                    <>
                        <div className="headerImageContainer"></div>
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <TextField
                                    type="text"
                                    label="Where are you going?"
                                    variant="outlined"
                                    className="headerSearchInput"
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                <span
                                    onClick={() => {
                                        setOpenDate(!openDate);
                                        closeOptions(); // Close Options when DateRange opens
                                    }}
                                    className="headerSearchText"
                                >
                                    {`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}
                                </span>
                                {openDate && (
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={(item) => setDates([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dates}
                                        className="date"
                                        minDate={new Date()}
                                    />
                                )}
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                                <span
                                    onClick={() => {
                                        setOpenOptions(!openOptions);
                                        closeDateRange(); // Close DateRange when Options opens
                                    }}
                                    className="headerSearchText"
                                >
                                    {`${options.adult} adult · ${options.children} children · ${options.room} rooms`}
                                </span>
                                {openOptions && (
                                    <div className="options">
                                        <div className="optionItem">
                                            <span className="optionText">Adult</span>
                                            <div className="optionCounter">
                                                <Button
                                                    disabled={options.adult <= 1}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("adult", "d")}
                                                >
                                                    -
                                                </Button>
                                                <span className="optionCounterNumber">{options.adult}</span>
                                                <Button
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("adult", "i")}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="optionItem">
                                            <span className="optionText">Children</span>
                                            <div className="optionCounter">
                                                <Button
                                                    disabled={options.children <= 0}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("children", "d")}
                                                >
                                                    -
                                                </Button>
                                                <span className="optionCounterNumber">{options.children}</span>
                                                <Button
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("children", "i")}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="optionItem">
                                            <span className="optionText">Room</span>
                                            <div className="optionCounter">
                                                <Button
                                                    disabled={options.room <= 1}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("room", "d")}
                                                >
                                                    -
                                                </Button>
                                                <span className="optionCounterNumber">{options.room}</span>
                                                <Button
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("room", "i")}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="headerSearchItem">
                                <Button className="headerSearchBtn" onClick={handleSearch}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;
