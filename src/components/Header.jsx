

function Header() {
    return (
        <header>
        <h1 id="logo">
          <big>
            <i className="fa-solid fa-globe" />
          </big>{" "}
          World News
        </h1>
        <nav>
          <ul>
            <li>
              <a
                href="#"
                onClick="active(this)"
                className="category active"
                data-category="general"
              >
                General
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick="active(this)"
                className="category"
                data-category="technology"
              >
                Technology
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick="active(this)"
                className="category"
                data-category="sports"
              >
                Sports
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick="active(this)"
                className="category"
                data-category="health"
              >
                Health
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick="active(this)"
                className="category"
                data-category="entertainment"
              >
                Entertainment
              </a>
            </li>
          </ul>
        </nav>
        <div id="opt">
          <input
            type="text"
            id="search-input"
            placeholder="Search for the latest news..."
          />
          <button id="search-btn">Search</button>
          <select id="language-select">
            <option value="en" selected="">
              en
            </option>
            <option value="fr">fr</option>
            <option value="es">es</option>
            <option value="de">de</option>
            <option value="ar">ar</option>
          </select>
        </div>
      </header>
    )
}

export default Header