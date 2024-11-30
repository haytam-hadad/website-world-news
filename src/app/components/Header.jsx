"use client";

import { useRouter } from "next/navigation";
import SideMenu from "./SideMenu";
import { useState } from "react";
import UserLocation from "./CurrentWeather";
import TopSearchBar from "./TopSearchBar";
import  Link from "next/link";

const navLinkCatg = [
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];



const TopSearshsArray = [
  "BBC news",
  "CNN news",
  "fox news",
  "russia ukraine",
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
  showInpBox,
  setShowInpBox,
}) {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [search, setSearch] = useState('');
  const ShowSideMenu = () => {
    setShowSideMenu((prev) => !prev);
  };

  const searchFunc = () => {
    router.push(`/search/${search}`);
  };

  const setActivation = (e) => {
    const navLinks = document.querySelectorAll('nav .link');
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
  };

  const toggleSearchInput = () => {
    setShowInpBox((prev) => !prev);
    if (showInpBox) {
      setSearch("");
    }
  };

  const router = useRouter();
  console.log(router)

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
        </div>
        <div className="header">
          <i
            id="bars"
            className="fa-solid fa-bars"
            onClick={() => ShowSideMenu()}
          ></i>
          <nav>
            <ul>
            { 
            navLinkCatg.map((catg, i) => {
              const href = i === 0 ? "/" : `/category/${catg}`;
              return (
                <Link
                  href={href}
                  key={i}
                  className={`link${router.pathname == href ? " active" : ""}`}
                  onClick={(e) => setActivation(e)}
                >
                  {i === 0 ? "Home" : catg}
                </Link>
              );
            })
          }

            </ul>
          </nav>
          <div className="notNav">
            <span
              className={showInpBox ? "icon_search v2" : "icon_search v1"}
              onClick={toggleSearchInput}
            >
              <span id="search-word"> </span> <i className="fa-solid fa-magnifying-glass"></i>
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
                onKeyDown={(e) => e.key == "Enter" && searchFunc()}
              />
              <button id="search-btn" onClick={() => searchFunc()}>
              <i className="fa-solid fa-magnifying-glass"></i> Search
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
              setShowInpBox={setShowInpBox}
            />
          </div>
        )}
      </header>
      {showSideMenu ? <SideMenu setCategState={setCategState} setShowSideMenu={setShowSideMenu} /> : null}
    </>
  );
}

export default Header;
