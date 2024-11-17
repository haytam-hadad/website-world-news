
import Link from "next/link";

export default function SideMenu({ setCategState , setShowSideMenu}) {
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
          <li>
            <i
            className="fa-solid fa-xmark"
            onClick={() => setShowSideMenu((prev) => !prev)}
            ></i>
          </li>
          {navLinkCatg.map((catg, i) => <li key={i}><Link href={`${window.location.origin}/news/${catg}`} key={i} className={i === 0 ? "link active" + catg : "link"} onClick={(e) => changeCateg(e)}>{catg}</Link></li>)}
        </ul>
      </nav>
    </div>
  );
}
