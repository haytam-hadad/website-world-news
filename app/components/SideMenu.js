import { useState, useRef } from "react";
import { Home , Laptop, HeartPulse, Trophy, Landmark, ChartNoAxesCombined, ChevronUp, ChevronDown, TestTube } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Technology", path: "/category/technology", icon: <Laptop size={20} /> },
  { name: "Health", path: "/category/health", icon: <HeartPulse size={20} /> },
  { name: "Sports", path: "/category/sports", icon: <Trophy size={20} /> },
  { name: "Politics", path: "/category/politics", icon: <Landmark size={20} /> },
  { name: "Science", path: "/category/science", icon: <TestTube size={20} /> },
];

const SideMenu = ({ setVisible, setMenuWidth }) => {
  const [activePath, setActivePath] = useState("/");
  const [menuWidthState, setMenuWidthState] = useState(250);
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const menuRef = useRef(null);
  const resizeRef = useRef(null);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = menuRef.current.offsetWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth > 200 && newWidth < 500) {
        setMenuWidthState(newWidth);
        setMenuWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-lightgrey dark:bg-darkgrey select-none mt-[4.5rem] left-0 top-0 h-full p-4 z-40"
      style={{ width: `${menuWidthState}px` }}
    > 
     <Link href="/">
        <button
          onClick={() => {
            setActivePath("/");
            setVisible(false);
          }}
          className={`side_menu_link ${activePath === "/" ? "bg-mainColor text-white" : "text-primary"
          }`}
        >
          <Home size={20} />
          <span className="text-base font-medium">Home</span>
        </button>
      </Link> 
      <Link className="flex md:hidden" href="/login">
        <button className="side_menu_link block w-full text-lg font-bold p-2 text-center border-2 border-mainColor rounded-xl  text-mainColor hover:bg-mainColor hover:text-white">
          Log in
        </button>
      </Link>


      <Link href="/trends">
        <button
          onClick={() => {
            setActivePath("/trends");
            setVisible(false);
          }}
          className={`side_menu_link ${ activePath === "/trends" ? "bg-mainColor text-white" : "text-primary"
          }`}
        >
          <ChartNoAxesCombined size={20} />
          <span className="text-base font-medium">Trends</span>
        </button>
      </Link>
      <hr className="my-2 border-gray-300 dark:border-gray-700"/>
      <div>
        <h2 className="text-md hover:opacity-100 px-10 font-medium m-1 flex items-center cursor-pointer opacity-60" onClick={() => setCategoriesVisible(!categoriesVisible)}>
          Categories&nbsp;
          {categoriesVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </h2>
        {categoriesVisible && (
          menuItems.map(({ name, path, icon }) => (
            <Link key={path} href={path}>
              <button
                onClick={() => {
                  setActivePath(path);
                  setVisible(false);
                }}
                className={`side_menu_link ${ activePath === path ? "bg-mainColor text-white" : "text-primary"
                }`}
              >
                {icon}
                <span className="text-base font-medium">{name}</span>
              </button>
            </Link>
          ))
        )}
      </div>
      <div
        ref={resizeRef}
        className="absolute top-0 right-0 h-full cursor-ew-resize bg-gray-200 dark:bg-gray-700"
        onMouseDown={handleMouseDown}
        style={{ width: "2px" }}
      />
    </div>
  );
};

export default SideMenu;

