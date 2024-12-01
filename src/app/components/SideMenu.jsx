"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const setActivation = (e) => {
  const navLinks = document.querySelectorAll('#sidemenu .link');
  navLinks.forEach(link => link.classList.remove('active'));
  e.target.classList.add('active');
};

export default function SideMenu({ setCategState , setShowSideMenu}) {
    
const navLinkCatg = [
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
  const pathname = useRouter().pathname;
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
          {navLinkCatg.map((catg, i) => (
            <li key={i}>
              <Link href={i === 0 ? "/" : `/news/${catg}`} onClick={(e) => setActivation(e)} className={"link" + ( pathname === `/news/${catg}` ? " active" : "")}>
                {i === 0 ? "Home" : catg}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
