import "./list.css"
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch"


const List = () => {

    const location = useLocation()
    const [destination, setDestination ] = useState(location.state.destination);
    const [options, setOptions ] = useState(location.state.options);
    const [min, setMin] = useState(undefined);
    const [max, setMax] = useState(undefined);

  
    const endMonth = parseInt(localStorage.getItem('endMonth'),10);
    const index = endMonth - 1;


    const [filteredData, setFilteredData] = useState([]);
    const [loadingFilteredData, setLoadingFilteredData] = useState(false);
    
    let calculatedPrice;
    const { data, loading, error, reFetch } = useFetch(`https://bookkaro.onrender.com/hotels?city=${destination}&min=${calculatedPrice || 0}&max=${calculatedPrice || 1000}`);
    useEffect(() => {
      if (data.length > 0) {
          const filteredHotels = data.filter((item) => {
          calculatedPrice = item.cheapestPrice * item.multiplier[index];
          console.log("Calculated Price: ", calculatedPrice)
          return (
            (min === undefined || calculatedPrice >= min) &&
            (max === undefined || calculatedPrice <= max)
          );
        });
  
        setFilteredData(filteredHotels);
      }
    }, [data, min, max, index]);
    

    console.log("filteredData:", filteredData);
    
    const handleClick = () => {
        reFetch();
    };


    return (
        <div>
          <Navbar />
          <Header type="list" />
          <div className="listContainer">
            <div className="listWrapper">
              <div className="listSearch">
                <h1 className="lsTitle">Search</h1>
                <div className="lsItem">
                  <label>Options</label>
                  <div className="lsOptions">
                    <div className="lsOptionItem">
                      <span className="lsOptionText">
                        Min price <small>per night</small>
                      </span>
                      <input type="number" onChange={e=>setMin(Math.max(0, parseInt(e.target.value)))} className="lsOptionInput"/>
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">
                        Max price <small>per night</small>
                      </span>
                      <input
                        type="number" className="lsOptionInput" onChange={e=>setMax(Math.max(0, parseInt(e.target.value)))} 
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Adult</span>
                      <input
                        type="number"
                        min={1}
                        className="lsOptionInput"
                        placeholder={options.adult}
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Children</span>
                      <input
                        type="number"
                        min={0}
                        className="lsOptionInput"
                        placeholder={options.children}
                      />
                    </div>
                    <div className="lsOptionItem">
                      <span className="lsOptionText">Room</span>
                      <input
                        type="number"
                        min={1}
                        className="lsOptionInput"
                        placeholder={options.room}
                      />
                    </div>
                  </div>
                </div>
                <button onClick={handleClick}>Search</button>
              </div>
              <div className="listResult">
                {loading ? ("loading") : (
                    <>
                        {filteredData.map((item) => (
                          <SearchItem item={item} key={item._id} />
                        ))}
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

export default List;