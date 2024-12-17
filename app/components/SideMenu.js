import Link from "next/link";

const SideMenu = () => {
  return (
    <div
      className="flex flex-col justify-start items-center fixed left-[-100%] w-full h-full bg-secondaryColor dark:bg-thirdColor transition-all ease-in-out" 
      style={{ animation: "slideIn 0.4s forwards" }}
    >
    <style>{"@keyframes slideIn { from { left: -100%; } to { left: 0; } }"}</style>
      <Link href="/home" className="sidenav_Link">
        Home
      </Link>
      <Link href="/health" className="sidenav_Link">
        Health
      </Link>
      <Link href="/sports" className="sidenav_Link">
        Sports
      </Link>
      <Link href="/technologies" className="sidenav_Link">
        Technologies
      </Link>
      <Link href="/politics" className="sidenav_Link">
        Politics
      </Link>
      <Link href="/weather" className="sidenav_Link">
        Weather
      </Link>
    </div>
  );
};

export default SideMenu;
