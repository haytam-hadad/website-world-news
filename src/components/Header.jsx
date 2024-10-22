import { FaSearch , FaBars } from "react-icons/fa";
import { useState } from "react";

function Header({setCategState}) {
  const [showInpBox, setShowInpBox] = useState(false);
  const showSearchInputBloc = () => {
    setShowInpBox(!showInpBox);
    setTimeout(() => {
      document.getElementById("search-input").focus();
    }, 250);
  };

  function changeCateg(e) {
    setCategState(e.target.innerText);
  }


  return (
    <header>
      <div className="first_header" >
        <span id="dateNow"> - {new Date().toDateString()}</span>
          <h1 id="logo">
            <i className="fa-solid fa-globe" /> World News
          </h1>
          <span ></span>
      </div>
      <div className="header">
        <FaBars id="bars"/>
        <nav>
          <ul>
            <li className="general"
                onClick={(e) => changeCateg(e)}>
                General
            </li>
            <li className="technology"
                onClick={(e) => changeCateg(e)}>
                Technology
            </li>
            <li className="sports"
                onClick={(e) => changeCateg(e)}>

                Sports
            </li>
            <li
              className="health"
              onClick={(e) => changeCateg(e)}>
                Health
            </li>
            <li className="entertainment"
                onClick={(e) => changeCateg(e)}>
                Entertainment
            </li>
            <li
                className="weather"
                onClick={(e) => changeCateg(e)}>
                Weather
            </li>
          </ul>
        </nav>
        <div className="notNav">
          <span className= {showInpBox ?  "icon_search v2" : "icon_search v1"} onClick={showSearchInputBloc}>
            <span id="search-word"> </span> <FaSearch />
          </span>
          <button className="main_btn">
              Sign In
            </button>
            <button className="main_btn">
              Log In
            </button>          
        </div>

      </div>

      {showInpBox && (
        <div id="input_box">
          <input
            type="text"
            id="search-input"
            placeholder="Search for the latest news..."
          />
          <button id="search-btn">
            <FaSearch /> Search
          </button>
          <select id="language-select" defaultValue="en">
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="es">es</option>
            <option value="de">de</option>
            <option value="ar">ar</option>
          </select>
        </div>
      )}
      
    </header>
  );
}

export default Header;
