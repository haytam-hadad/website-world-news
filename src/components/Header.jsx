import { FaSearch , FaBars } from "react-icons/fa";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Header() {
  const [showInpBox, setShowInpBox] = useState(false);
  const [activeCategory, setActiveCategory] = useState("general");

  const showSearchInputBloc = () => {
    setShowInpBox(!showInpBox);
    setTimeout(() => {
      document.getElementById("search-input").focus();
    }, 250);
  };

  // const handleCategoryClick = (category) => {
  //   setActiveCategory(category);
  // };

  return (
    <header>
      <div className="first_header" >
        <span id="dateNow"> <i className="fa-regular fa-calendar"></i> - {new Date().toDateString()}</span>
          <h1 id="logo">
            <i className="fa-solid fa-globe" /> World News
          </h1>
          <span ></span>
      </div>
      <div className="header">
        <FaBars id="bars"/>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={`category ${activeCategory === "general" ? "active" : ""}`}
              >
                General
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/technology"
                className={`category ${activeCategory === "technology" ? "active" : ""}`}
              >
                Technology
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sports"
                className={`category ${activeCategory === "sports" ? "active" : ""}`}
              >
                Sports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/health"
                className={`category ${activeCategory === "health" ? "active" : ""}`}
              >
                Health
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/entertainment"
                className={`category ${activeCategory === "entertainment" ? "active" : ""}`}
              >
                Entertainment
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/entertainment"
                className={`category ${activeCategory === "Weather" ? "active" : ""}`}
              >
                Weather
              </NavLink>
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
