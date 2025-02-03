import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">

      <div className="flex flex-col justify-center p-6 md:p-12">
        <form className="flex flex-col space-y-5 max-w-sm mx-auto w-full">
          <h1 className="text-center text-4xl font-bold text-foreground mb-6">
            Log in
          </h1>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-[#222] bg-gray-100"
              placeholder="Email address"
            />
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-[#222] bg-gray-100"
              placeholder="Password"
            />
          </label>
          <span className="text-sm font-medium text-muted-foreground">
            Don't have an account?&nbsp;
            <Link href="/sign-up" className="text-primary underline">
              Sign up
            </Link>
          </span>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-white font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Log in
          </button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm font-medium text-muted-foreground">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-lg border px-4 py-2 font-medium bg-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2"
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width={24}
              height={24}
              alt="Google logo"
              className="mr-2"
            />
            Sign in with Google
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex items-center justify-center bg-gray-100 dark:bg-[#222] p-10">
        <Image
          src="/images/i2.svg"
          width={400}
          height={400}
          alt="Login Illustration"
          className="w-[80%] max-w-sm object-contain"
        />
      </div>
    </div>
  );
}
