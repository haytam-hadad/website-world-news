import Link from "next/link";

const SideMenu = ({ setVisible }) => {
  const handleClick = () => {
    setVisible(false);
  };

  return (
    <div
      className="flex z-50 flex-col justify-start items-center fixed left-[-100%] w-full h-full bg-secondaryColor dark:bg-thirdColor transition-all ease-in-out" 
      style={{ animation: "slideIn 0.4s forwards" }}
    >
    <style>{"@keyframes slideIn { from { left: -100%; } to { left: 0; } }"}</style>
      <Link href="/" onClick={handleClick} className="sidenav_Link">
        Home
      </Link>
      <Link href="/login" onClick={handleClick} className="sidenav_Link text-primary">
        Log in
      </Link>
      <Link href="/sign-up" onClick={handleClick} className="sidenav_Link text-primary">
        Sign up
      </Link>
      <Link href="/health" onClick={handleClick} className="sidenav_Link">
        Health
      </Link>
      <Link href="/sports" onClick={handleClick} className="sidenav_Link">
        Sports
      </Link>
      <Link href="/technologies" onClick={handleClick} className="sidenav_Link">
        Technologies
      </Link>
      <Link href="/politics" onClick={handleClick} className="sidenav_Link">
        Politics
      </Link>
      <Link href="/weather" onClick={handleClick} className="sidenav_Link">
        Weather
      </Link>
    </div>
  );
};

export default SideMenu;

