import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [showInpBox, setShowInpBox] = useState(false);
  const [activeCategory, setActiveCategory] = useState("general");

  const showSearchInputBloc = () => {
    setShowInpBox(!showInpBox);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <header>
      <div className="header">
        <h1 id="logo">
          <big>
            <i className="fa-solid fa-globe" />
          </big>{" "}
          World News
        </h1>
        <nav>
          <ul>
            <li>
              <Link
                to="/general"
                className={`category ${activeCategory === "general" ? "active" : ""}`}
              >
                General
              </Link>
            </li>
            <li>
              <Link
                to="/technology"
                className={`category ${activeCategory === "technology" ? "active" : ""}`}
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                to="/sports"
                className={`category ${activeCategory === "sports" ? "active" : ""}`}
              >
                Sports
              </Link>
            </li>
            <li>
              <Link
                to="/health"
                className={`category ${activeCategory === "health" ? "active" : ""}`}
              >
                Health
              </Link>
            </li>
            <li>
              <Link
                to="/entertainment"
                className={`category ${activeCategory === "entertainment" ? "active" : ""}`}
              >
                Entertainment
              </Link>
            </li>
          </ul>
        </nav>
        <span id="icon_search" onClick={showSearchInputBloc}>
          <span id="search-word"> </span> <FaSearch />
        </span>
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
