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


import image2 from '../images/hotel_2.2.jpg';
import image1 from '../images/hotel_1.1.jpg';
import image3 from '../images/hotel_3.3.jpg';
import image4 from '../images/hotel_4.4.jpg';

const Header = ({ type }) => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    ]);


    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    })

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

    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}
                style={type !== "list" ? { background: images[currentImageIndex] } : {}}>
                {type !== "list" &&
                    <>

                        <div className="headerImageContainer"></div>
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                    className="headerSearchInput"
                                    onChange={e => setDestination(e.target.value)}
                                />
                            </div>

                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">{`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
                                {openDate && (
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={item => setDates([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dates}
                                        className="date"
                                        minDate={new Date()}
                                    />
                                )}
                            </div>

                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                                <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult · ${options.children} children · ${options.room} rooms`}</span>
                                {openOptions && (
                                    <div className="options">
                                        <div className="optionItem">
                                            <span className="optionText">Adult</span>
                                            <div className="optionCounter">
                                                <button
                                                    disabled={options.adult <= 1}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("adult", "d")}>
                                                    -</button>
                                                <span className="optionCounterNumber">{options.adult}</span>
                                                <button
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("adult", "i")}
                                                >+</button>
                                            </div>
                                        </div>
                                        <div className="optionItem">
                                            <span className="optionText">Children</span>
                                            <div className="optionCounter">
                                                <button
                                                    disabled={options.children <= 0}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("children", "d")}
                                                >-</button>
                                                <span className="optionCounterNumber">{options.children}</span>
                                                <button className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                                            </div>
                                        </div>
                                        <div className="optionItem">
                                            <span className="optionText">Room</span>
                                            <div className="optionCounter">
                                                <button
                                                    disabled={options.room <= 1}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("room", "d")}>
                                                    -</button>
                                                <span className="optionCounterNumber">{options.room}</span>
                                                <button className="optionCounterButton" onClick={() => handleOption("room", "i")}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="headerSearchItem">
                                <button className="headerSearchBtn" onClick={handleSearch}>Search</button>
                            </div>

                        </div></>}
            </div>
        </div>
    )
}

export default Header;
