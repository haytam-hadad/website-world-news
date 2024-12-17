
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Earth } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Menu } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import Image from "next/image";


export default function Header({ setTheme, theme }) {
  return (
    <header className="flex flex-col px-[3%] w-full mb-5 sticky top-0 z-50 bg-secondaryColor dark:bg-thirdColor max-md:px-1">
      <div className="flex justify-between p-4 items-center text-maintextColor dark:text-secondaryColor">
        <h1 className="font-bold text-3xl max-md:text-xl flex items-center justify-start">
          <Earth className="w-11  h-11 max-md:w-8 max-md:h-8 mx-2" /> World news
        </h1>
        {/* <Image
          src="/images/logo.png"
          alt="www"
          width={300}
          height={300}
          className="w-1/5 "
        /> */}
        <div className="flex justify-end items-center gap-4 max-md:gap-2">
          <div className="max-md:scale-75 border-2 border-mainColor rounded-full p-1 flex items-center gap-1">
            <Switch onClick={() => setTheme((prev) => !prev)} />
            <Label htmlFor="Dark-Mode ">
              {!theme ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Label>
          </div>
            <Link href="/login">
              <button
              className="py-2 px-5 max-md:px-3 max-md:py-1 font-semibold dark:bg-secondaryColor text-secondaryColor dark:text-mainTextColor bg-thirdColor border rounded-full"
              >
                Log in
              </button>
            </Link>
            <Link href="/sign-in">
              <button
              className="py-2 px-5 max-md:px-3 max-md:py-1 font-semibold  border rounded-full bg-mainColor text-secondaryColor"
              >
                Sign in
              </button>
            </Link>
        </div>
      </div>
      <div className=" bg-mainColor shadow-md rounded-full text-sm py-2 px-4 flex justify-around items-center gap-1 max-md:py-1 max-md:px-2">
        <div className="text-secondaryColor flex max-md:hidden text-center w-3/5 justify-around items-center">
          <Link href="/home" className="nav_Link">
            Home
          </Link>
          <Link href="/health" className="nav_Link">
            Health
          </Link>
          <Link href="/sports" className="nav_Link">
            Sports
          </Link>
          <Link href="/technologies" className="nav_Link">
            Technologies
          </Link>
          <Link href="/politics" className="nav_Link">
            Politics
          </Link>
          <Link href="/weather" className="nav_Link">
            Weather
          </Link>
        </div>
        <Toggle
          className="flex rounded-3xl md:hidden cursor-pointer"
          aria-label="Toggle nav bar"
        >
          <Menu className="scale-125 " />
        </Toggle>

        <div className="flex items-center w-2/5 max-md:w-full font-semibold gap-1">
          <div className="relative flex items-center w-full">
            <Input
              placeholder="Search for news..."
              className="h-8 w-full border-2 border-secondaryColor px-5 rounded-full text-thirdColor bg-secondaryColor"
            />
            <Search className="absolute right-2 w-5 h-5 text-mainColor" />
          </div>
        </div>
      </div>
    </header>
  );
}
