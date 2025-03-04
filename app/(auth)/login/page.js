"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeContext } from "../../ThemeProvider";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, setUser } = useContext(ThemeContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(`/`);
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Login failed. Please try again.");
        return;
      }

      const userData = await response.json();
      setUser(userData);
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Login failed. Please try again.");
        return;
      }

      const userData = await response.json();
      setUser(userData);
      router.push(`/`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[4fr_2fr] overflow-x-hidden">
      <div className="flex mt-5 flex-col justify-center">
        <form
          className="flex flex-col space-y-3 p-5 sm:p-10 rounded-xl dark:bg-black border shadow-md bg-secondaryColor max-w-xl mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl p-1 font-bold text-foreground mb-6">
            Log in
          </h1>

          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form_input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form_input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="text-[12px] text-center font-medium text-muted-foreground">
            Forgot your password?
            <Link
              href="/forgot-password"
              className="text-primary underline hover:text-mainColor"
            >
              Click here
            </Link>
          </p>

          <p className="text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="text-primary underline hover:text-mainColor "
            >
              Sign up
            </Link>
          </p>

          {error && (
            <div className="error mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="main_btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-2 text-sm font-medium text-muted-foreground">
              OR
            </span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full rounded-lg shadow-sm border border-darkgrey px-4 py-3  font-medium bg-white hover:shadow-lg transition-all focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2 text-black"
            onClick={handleGoogleLogin}
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

  <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex items-center justify-center p-5 rounded-3xl "
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/images/i1.svg"
            width={400}
            height={400}
            alt="Sign Up Illustration"
            className=" max-w-sm m-auto object-contain dark:filter dark:invert opacity-85"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
