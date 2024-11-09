import { FaSearch } from "react-icons/fa";
import SideMenu from "./SideMenu";
import { useState } from "react";
import UserLocation from "./CurrentWeather";
import TopSearchBar from "./TopSearchBar";

const navLinkCatg = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const TopSearshsArray = [
  "BBC news",
  "russia and ukraine",
  "gaza",
  "morocco",
  "Trump",
  "Football News",
  "Bitcoin",
];


function Header({
  setCategState,
  setLanguage,
  language,
  search,
  setSearch,
  setDosearch,
  showInpBox,
  setShowInpBox,
}) {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const ShowSideMenu = (e) => {
    e.target.classList.toggle("fa-bars");
    e.target.classList.toggle("fa-xmark");

    setShowSideMenu((prev) => !prev);
  };

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

  const toggleSearchInput = () => {
    setShowInpBox((prev) => !prev);
    if (showInpBox) {
      setSearch("");
    }
  };

  return (
    <>
      <header>
        <div className="first_header">
          <span id="dateNow">{new Date().toDateString()}</span>
          <h1 id="logo">
            <i className="fa-solid fa-globe" /> World News
          </h1>
          <span id="weatherNow">
            <UserLocation />
          </span>
          {/*new Date().toLocaleTimeString().slice(0,5)*/}
        </div>
        <div className="header">
          <i
            id="bars"
            className="fa-solid fa-bars"
            onClick={(e) => ShowSideMenu(e)}
          ></i>
          <nav>
            <ul>
              {navLinkCatg.map((catg, i) => (
                <li
                  key={catg}
                  className={
                    i === 0 ? `${catg.toLowerCase()} active` : catg.toLowerCase()
                  } 
                  onClick={(e) => changeCateg(e)}
                >
                  {catg}
                </li>
              )) }

            </ul>
          </nav>
          <div className="notNav">
            <span
              className={showInpBox ? "icon_search v2" : "icon_search v1"}
              onClick={toggleSearchInput}
            >
              <span id="search-word"> </span> <FaSearch />
            </span>
            <button className="main_btn">Sign In</button>
            <button className="main_btn">Log In</button>
          </div>
        </div>

        {!showInpBox ? null : (
          <div id="switch">
            <div id="input_box">
              <input
                ref={(input) => {
                  input && input.focus();
                }}
                type="text"
                id="search-input"
                placeholder="Search for the latest news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && setDosearch(true)}
              />
              <button 
                id="search-btn" 
                onClick={() => setDosearch(true)} 
              >
                <FaSearch /> Search
              </button>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">en</option>
                <option value="fr">fr</option>
                <option value="es">es</option>
                <option value="ar">ar</option>
              </select>
            </div>
            <TopSearchBar
              TopSearshsArray={TopSearshsArray}
              setSearch={setSearch}
              setDosearch={setDosearch}
              setShowInpBox={setShowInpBox}
            />
          </div>
        )}
      </header>
      {showSideMenu ? <SideMenu setCategState={setCategState} /> : null}
    </>
  );
}

export default Header;
