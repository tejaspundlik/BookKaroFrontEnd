import "./hotel.css";
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react";
import { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import StarRatings from 'react-star-ratings';
import Icon from "@mdi/react";
import { mdiPool, mdiWifi, mdiDumbbell, mdiSilverwareForkKnife, mdiSpa, mdiCoffee, mdiBriefcaseAccount, mdiParking, mdiFoodApple, mdiFoodForkDrink } from '@mdi/js'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Hotel = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [slideNumber, setSlideNumber] = useState(0);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [rating, setRating] = useState('');
    const [text, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [err, setError] = useState(null);


    const { data, loading, error } = useFetch(`https://bookkaro.onrender.com/hotels/find/${id}`)
    const { user } = useContext(AuthContext);
    const [commentsArray, setCommentsArray] = useState([]);
    const amenities = data.amenities;
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
    };

    const handleRating = (e) => {
        const newRating = parseFloat(e.target.value);
        if (!isNaN(newRating)) {
            setRating(Math.min(5, Math.max(0, newRating)));
        }
        setSubmitted(false);
    };

    const handleReview = (e) => {
        setReview(e.target.value)
        setSubmitted(false);
    }

    const handleSendReviews = async e => {
        e.preventDefault()

        if (!user) {
            setError("Login To Send Reviews");
            console.log(err);
        }
        else {
            try {
                const newReview = {
                    name: name,
                    rating: rating,
                    text: text,
                    email: user.email,
                };

                await axios.post(`https://bookkaro.onrender.com/hotels/review/${id}`, newReview)
                setSubmitted(true)
                alert("Review Submitted");
                window.location.assign(`/hotels/${id}`);

            } catch (err) {
                console.log(err)
                setError(err.response.data.message);
            }
        }
    };


    function getAmenityIcon(amenity) {
        switch (amenity) {
            case "pool":
                return <Icon path={mdiPool} size={1} />;
            case "wifi":
                return <Icon path={mdiWifi} size={1} />;
            case "dumbbell":
                return <Icon path={mdiDumbbell} size={1} />;
            case "silverware-fork-knife":
                return <Icon path={mdiSilverwareForkKnife} size={1} />;
            case "spa":
                return <Icon path={mdiSpa} size={1} />;
            case "breakfast":
                return <Icon path={mdiCoffee} size={1} />;
            case "briefcase-account":
                return <Icon path={mdiBriefcaseAccount} size={1} />
            case "car-parking":
                return <Icon path={mdiParking} size={1} />
            case "food-apple":
                return <Icon path={mdiFoodApple} size={1} />
            case "briefcase":
                return <Icon path={mdiBriefcaseAccount} size={1} />
            case "food-fork-drink":
                return <Icon path={mdiFoodForkDrink} size={1} />
            default:
                return null;
        }
    }



    useEffect(() => {
        if (data.comments && Array.isArray(data.comments)) {
            setCommentsArray(data.comments.map((comment) => {
                const [author, rating, reviews] = comment.match(/^(.*?)\.(\d+)\.(.*)$/).slice(1);
                return {
                    author,
                    rating: parseFloat(rating),
                    reviews,
                };
            }));
        }
    }, [data]);



    const navigate = useNavigate()
    let days = 0;
    const { dates, options } = useContext(SearchContext);
    if (localStorage.getItem('startDate') === null) {
        localStorage.setItem('startDate', '2023-11-27T18:30:00.000Z');
        localStorage.setItem('endDate', '2023-11-28T18:30:00.000Z');
        localStorage.setItem('optionsRoom', 'room:1');
        localStorage.setItem('endMonth', 11);
        days = 1
    }
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');
    const optionsRoom = localStorage.getItem('optionsRoom');
    const endMonth = parseInt(localStorage.getItem('endMonth'), 10);
    const index = endMonth - 1;
    const startDate = new Date(storedStartDate);
    const endDate = new Date(storedEndDate);


    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    function dayDifference(date1, date2) {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
        return diffDays;
    }


    if (storedEndDate && storedStartDate) {
        console.log("Start and end dates ", startDate, endDate)
        days = dayDifference(endDate, startDate);
    }

    const handleOpen = (i) => {
        setSlideNumber(i);
        setOpen(true);
    }
    const [multiResult, setMultiResult] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const multi = await handleMulti();
                console.log("tac multi", multi)
                setMultiResult(multi);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            }
        };

        fetchData();
    }, [id]);

    const handleMulti = async () => {
        try {
            const response = await axios.get(`https://bookkaro.onrender.com/hotels/find/${id}`);
            const hotelData = response.data;
            const result = days * hotelData.cheapestPrice * hotelData.multiplier[index];
            return result;
        }
        catch (error) {
            console.error('Error calculating result:', error);
            return null;
        }
    };

    const handleMove = (direction) => {
        let newSlideNumber;

        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
        }
        setSlideNumber(newSlideNumber)
    };


    const handleClick = () => {

        if (user) {
            setOpenModal(true)
        } else {
            navigate("/login")
        }
    };

    const handleReviewsMove = (direction) => {
        const container = document.querySelector(".reviewsContainer");

        if (direction === "l") {
            container.scrollLeft -= 1000;
        } else {
            container.scrollLeft += 1000;
        }
    };
    return (
        <div>
            <Navbar />
            <Header type="list" />
            {loading ? ("loading") : (
                <div className="hotelContainer">
                    {open && <div className="slider">
                        <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={() => setOpen(false)} />
                        <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow" onClick={() => handleMove("l")} />
                        <div className="sliderWrapper">
                            <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
                        </div>
                        <FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={() => handleMove("r")} />
                    </div>}

                    <div className="hotelWrapper">
                        <h1 className="hotelTitle">{data.name}</h1>

                        <div className="hotelAddress">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>{data.address}</span>
                        </div>

                        <span className="hotelDistance">
                            Excellent location – {data.distance}m from center
                        </span>

                        <span className="hotelPriceHighlight">
                            Book a stay over ${data.cheapestPrice} at this property and get a free airport taxi
                        </span>

                        <div className="hotelImages">
                            {data.photos?.map((photo, i) => (
                                <div key={i} className="hotelImgWrapper">
                                    <img onClick={() => handleOpen(i)} src={photo} alt="" className="hotelImg" />
                                </div>
                            ))}
                        </div>

                        <div className="hotelDetails">

                            <div className="hotelDetailsColumn">

                                <div className="hotelDetailsTexts">
                                    <h1 className="hotelTitle">{data.title}</h1>
                                    <p className="hotelDesc">{data.description}</p>
                                </div>

                                <div className="hotelAmenities">
                                    <h1>Amenities</h1>

                                    <div className="amenitiesIcons">
                                        {amenities && amenities.map((amenity, index) => (
                                            <div key={index} className="amenityItem">
                                                {getAmenityIcon(amenity)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>


                            <div className="hotelDetailsPrice">

                                <h1>Perfect for a {days}-night stay!</h1>
                                <h2>
                                    <b>${parseInt(multiResult, 10)}</b> ({days} nights)
                                </h2>
                                <button onClick={handleClick}>Reserve or Book Now!</button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {openModal && <Reserve setOpen={setOpenModal} hotelId={id} price={parseInt(multiResult, 10)} />}

            <div className="hotelReviews">
                <h1 className="reviewsTitle">Reviews</h1>

                <div className="sliderReviews">
                    <div className="reviewsContainer">
                        {commentsArray.map((comment, i) => (
                            <div
                                key={i}
                                className={`reviewBox ${i === slideNumber ? "active" : ""}`}
                            >
                                <div className="reviewHead">
                                    <div className="reviewAuthor">
                                        <h3>
                                            <b>{comment.author}</b>
                                        </h3>
                                    </div>
                                    <div className="reviewStars">
                                        <StarRatings
                                            rating={comment.rating}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="0px"
                                        />
                                    </div>
                                </div>
                                <div className="review">{comment.reviews}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sliderControls">
                    <FontAwesomeIcon
                        icon={faCircleArrowLeft}
                        className="arrow"
                        onClick={() => handleReviewsMove("l")}
                    />
                    <FontAwesomeIcon
                        icon={faCircleArrowRight}
                        className="arrow"
                        onClick={() => handleReviewsMove("r")}
                    />
                </div>
            </div>


            <div className="reviewDiv">
                <div className="bs">
                    <h3>Please leave a review for our beloved hotel. </h3>
                    <h4>It will help us grow more.</h4>
                </div>
                <div className="Reviewcontainer">
                    <div className="header">
                        <div className="text">Submit A Review</div>
                        <div className="underline"></div>
                    </div>
                    {err && (
                        <Stack sx={{ width: '100%' }} spacing={2} className="error">
                            <Alert severity="error" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {err}
                            </Alert>
                        </Stack>
                    )}
                    <div className="inputs">
                        <div className="input">
                            <input
                                type="text"
                                value={name}
                                onChange={handleName}
                                placeholder="Name"
                                id="Name"
                            />
                        </div>

                        <div className="input">
                            <input
                                type="number"
                                value={rating}
                                onChange={handleRating}
                                placeholder="Ratings out of 5"
                                id="ratings"
                            />
                        </div>

                        <div className="input">
                            <input
                                type="text"
                                value={text}
                                onChange={handleReview}
                                placeholder="Review"
                                id="review"
                            />
                        </div>
                    </div>

                    <div className="submit-container">
                        <div className="submit" type="submit" onClick={handleSendReviews}>Submit</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hotel;
