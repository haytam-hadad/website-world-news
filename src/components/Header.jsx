import { FaSearch , FaBars } from "react-icons/fa";
import { useState } from "react";

function Header({setCategState, setLanguage , language , search , setSearch , setDosearch }) {
  const [showInpBox, setShowInpBox] = useState(false);

  function changeCateg(e) {
    addActivation(e);
    setCategState(e.target.innerText);
  }

  function addActivation(e) {
    const elements = document.querySelectorAll("li");
    elements.forEach((element) => {
      element.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
  }

  return (
    <header>
      <div className="first_header" >
        <span id="dateNow">{new Date().toDateString()}</span>
          <h1 id="logo">
            <i className="fa-solid fa-globe" /> World News
          </h1>
          <span id="timeNow">{new Date().toLocaleTimeString()}</span>
      </div>
      <div className="header">
        <FaBars id="bars"/>
        <nav>
          <ul>
            <li className="general active"
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
          <span className={showInpBox ? "icon_search v2" : "icon_search v1"} onClick={() => setShowInpBox(prev => !prev)}>
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

      {!showInpBox ? null : (
        <div id="input_box">
          <input
            type="text"
            id="search-input"
            placeholder="Search for the latest news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button id="search-btn" onClick={() => setDosearch(true)}>
            <FaSearch /> Search
          </button>
          <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="es">es</option>
            <option value="ar">ar</option>
          </select>
        </div>
      )}
      
    </header>
  );
}

export default Header;
