import Image from "next/image";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-black min-h-screen flex items-center justify-center">
      <Image
        src="/images/i1.svg"
        alt="Loading..."
        width={70}
        height={70}
        className="animate-spin dark:filter dark:invert opacity-80"
      />
    </div>
  );
}

