import { Link } from "react-router-dom";
import "./searchItem.css"


const SearchItem = ({item}) => {

    const endMonth = parseInt(localStorage.getItem('endMonth'),10);
    const index = endMonth - 1;
    // console.log(index);
    // console.log(item);
    return (
        <div className="searchItem">
           <img
            src={item.photos[0]}
            alt=""
            className="siImg"
            /> 
            <div className="siDesc">
                <h1 className="siTitle">{item.name}</h1>
                <span className="siDistance">{item.distance}m from center</span>
                <span className="siTaxiOp">Free airport taxi</span>
                <span className="siSubtitle">
                    Studio Apartment with Air conditioning
                </span>
                <span className="siFeatures">
                    {item.description}
                </span>
                <span className="siCancelOp">Free cancellation </span>
                <span className="siCancelOpSubtitle">
                You can cancel later, so lock in this great price today!
                </span>
            </div>
            <div className="siDetails">
                {item.rating && <div className="siRating">
                    <span>Excellent</span>
                    <button>{item.rating}</button>
                </div>}
                <div className="siDetailTexts">
                    <span className="siPrice">${parseInt(item.cheapestPrice * item.multiplier[index])}</span>

                    <Link to={`/hotels/${item._id}`}>
                        <button className="siCheckButton">See availability</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;