import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-1 gap-0 md:px-20 md:grid-cols-2">
      <div className="p-6 md:p-12 rounded-md flex flex-col justify-center">
        <form className="flex flex-col space-y-5">
          <h1 className="text-center text-4xl font-bold text-foreground mb-1">
            Sign up
          </h1>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Username</span>
            <input
              type="text"
              className="w-full rounded-md shadow-sm px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] border border-mainColor dark:border-mainColor-dark"
              placeholder="Username"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="w-full rounded-md shadow-sm px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] border border-mainColor dark:border-mainColor-dark"
              placeholder="Email"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] border border-mainColor dark:border-mainColor-dark"
              placeholder="Password"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Confirm Password</span>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] border border-mainColor dark:border-mainColor-dark"
              placeholder="Confirm Password"
              required
            />
          </label>
          <span className="text-sm font-medium text-muted-foreground">
            Already have an account? &nbsp;
            <Link href="/login" className="text-primary underline">
              Log in
            </Link>
          </span>
          <div className="hidden bg-[crimson] text-sm text-white p-2 rounded-md mb-4">
            <span className="block">Email, Username or Password are not correct.</span>
          </div>
          <button
            type="submit"
            className="w-full shadow-lg text-secondaryColor dark:text-mainTextColor rounded-md hover:bg-primary px-3 py-2 font-medium transition-colors bg-mainColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sign up
          </button>
        </form>
      </div>
      <div className="hidden md:block p-10 justify-center items-center">
        <Image
          src="/images/i2.svg"
          width={300}
          height={200}
          alt="Sign up Illustration"
          className="w-full object-contain dark:filter dark:invert scale-75 animate-rotate"
        />
      </div>
    </div>
  );
}


