import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex border-t-8 border-mainColor flex-col items-center justify-center w-full h-24 bg-primary text-primary-foreground font-bold space-y-2">
      <div className="flex items-center space-x-2">
        <Image
          src="/images/i1.svg"
          width={32}
          height={32}
          className="w-8 h-8 filter dark:filter-none invert"
          alt="My Logo"
        />
        <p className="text-sm text-center">
          World news | Copyright &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

