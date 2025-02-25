"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeContext } from "../ThemeProvider";

export default function LoginPage() {
  const { user, setUser } = useContext(ThemeContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(`/profile/${user.username}`);
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
      router.push(`/profile/${userData.username}`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_2fr]">
      <div className="flex flex-col justify-center px-3">
        <form
          className="flex flex-col space-y-5 max-w-lg mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl font-bold text-foreground mb-6">
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
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="text-primary underline hover:text-mainColor"
            >
              Click here
            </Link>
          </p>

          <p className="text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary underline hover:text-mainColor"
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
            className="w-full dark:bg-mainColor rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
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
            className="flex items-center justify-center w-full rounded-lg border px-4 py-2 font-medium bg-white shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2 text-black"
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

      <div className="hidden rounded-3xl md:flex items-center justify-center bg-lightgrey dark:bg-darkgrey shadow-sm p-5">
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
