import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="grid grid-cols-1 gap-0 md:px-14 md:grid-cols-2">
      <div className="p-6 md:p-12 rounded-md flex flex-col justify-center">
        <form className="flex flex-col space-y-4">
          <h1 className="text-center text-5xl font-bold tracking-tight text-foreground mb-4">
            Sign up
          </h1>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Username</span>
            <input
              type="text"
              className="w-full rounded-md shadow-sm px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] bg-[#f5f5f5] dark:bg-[#333]"
              placeholder="Username"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="w-full rounded-md shadow-sm px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] bg-[#f5f5f5] dark:bg-[#333]"
              placeholder="Email"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] bg-[#f5f5f5] dark:bg-[#333]"
              placeholder="Password"
              required
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Confirm Password</span>
            <input
              type="password"
              className="w-full rounded-md px-3 py-2 text-sm text-foreground outline-none ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-[#333] bg-[#f5f5f5] dark:bg-[#333]"
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
          <span className="text-sm font-medium text-muted-foreground">
            Or continue with
          </span>
          <button
            type="button"
            className="mt-4 w-full shadow-lg text-white rounded-md border px-3 py-2 font-medium transition-colors bg-[#fff] text-mainTextColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width={24}
              height={24}
              alt="Google logo"
              className="inline mr-2"
            />
            Continue with Google
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

