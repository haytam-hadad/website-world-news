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
      
    
const navLinkCatg = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

  return (
    <div id="sidemenu_cnt">
      <nav id="sidemenu">
        <ul>
          {navLinkCatg.map((elm, i) => <li key={i} className={i === 0 ? "active " + elm : elm} onClick={(e) => changeCateg(e)}>{elm}</li>)}
        </ul>
      </nav>
    </div>
  );
}
