export default function SideMenu({ setCategState}) {
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
    <div id="sidemenu_cnt">
      <nav id="sidemenu">
        <ul>
          <li className="general active" onClick={(e) => changeCateg(e)}>
            General
          </li>
          <li className="technology" onClick={(e) => changeCateg(e)}>
            Technology
          </li>
          <li className="sports" onClick={(e) => changeCateg(e)}>
            Sports
          </li>
          <li className="health" onClick={(e) => changeCateg(e)}>
            Health
          </li>
          <li className="entertainment" onClick={(e) => changeCateg(e)}>
            Entertainment
          </li>
          <li className="weather" onClick={(e) => changeCateg(e)}>
            Weather
          </li>
        </ul>
      </nav>
    </div>
  );
}
