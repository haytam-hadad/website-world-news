"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const setActivation = (e) => {
  const navLinks = document.querySelectorAll('#sidemenu .link');
  navLinks.forEach(link => link.classList.remove('active'));
  e.target.classList.add('active');
};

export default function SideMenu({ setCategState , setShowSideMenu}) {
    
const navLinkCatg = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
  const pathname = usePathname();
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
          {navLinkCatg.map((catg, i) => <li key={i}><Link href={`./${catg}`}  key={i} onClick={(e) => setActivation(e)} className={"link" + ( pathname === `/${catg}` ? " active" : "")}>{catg}</Link></li>)}
        </ul>
      </nav>
    </div>
  );
}
