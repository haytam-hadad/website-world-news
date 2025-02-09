import Image from 'next/image';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_2fr]">
      
      {/* Form Section */}
      <div className="flex mt-12 flex-col justify-center px-8 md:px-16">
        <form className="flex flex-col space-y-5 max-w-lg mx-auto w-full">
          <h1 className="text-center text-4xl font-bold text-foreground mb-6">Sign up</h1>

          {/* Username Input */}
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Username</span>
            <input
              type="text"
              className="from_input"
              placeholder="Username"
              required
            />
          </label>

          {/* Email Input */}
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="from_input"
              placeholder="Email"
              required
            />
          </label>

          {/* Password Input */}
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="from_input"
              placeholder="Password"
              required
            />
          </label>

          {/* Confirm Password Input */}
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Confirm Password</span>
            <input
              type="password"
              className="from_input"
              placeholder="Confirm Password"
              required
            />
          </label>

          {/* Login Link */}
          <span className="text-sm font-medium text-muted-foreground">
            Already have an account? &nbsp;
            <Link href="/login" className="text-primary underline hover:text-mainColor">Log in</Link>
          </span>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full dark:bg-mainColor rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign up
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm font-medium text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-up Button */}
          <button
            type="button"
            className="flex items-center justify-center w-full rounded-lg border px-4 py-2 font-medium bg-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2 text-black"
          >
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width={24}
              height={24}
              alt="Google logo"
              className="mr-2"
            />
            Continue with Google
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden rounded-3xl  md:flex items-center justify-center bg-lightgrey dark:bg-darkgrey shadow-sm p-5">
        <Image
          src="/images/i1.svg"
          width={400}
          height={400}
          alt="Sign Up Illustration"
          className="w-[80%] max-w-sm object-contain dark:filter dark:invert opacity-60"
        />
      </div>
    </div>
  );
}

