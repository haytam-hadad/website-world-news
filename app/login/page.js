"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeContext } from "../ThemeProvider";

export default function LoginPage() {
  const { user, setUser } = useContext(ThemeContext);
  const [username, setUsername] = useState(""); // Change from email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const loginData = {
      username: username.trim(), // Send username instead of email
      password: password.trim(),
    };

    console.log("Login data:", loginData);

    try {
      const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("Response status:", response.status);

      // Check if response is okay
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData?.message || "Login failed. Please try again.");
        return;
      }

      // Handle successful login
      const user = await response.json();
      console.log("User logged in:", user);

      // Save user data to global state
      setUser(user);

      // Redirect to dashboard or another page
      window.location.href = "/"; 
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Welcome, {user.username}!</h1>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            setUser(null);
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_2fr]">
      {/* Login Form Section */}
      <div className="flex flex-col justify-center px-8 md:px-16">
        <form
          className="flex flex-col space-y-5 max-w-lg mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl font-bold text-foreground mb-6">
            Log in
          </h1>

          {/* Username Input */}
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text" // Changed from email to text for username
              className="form_input"
              placeholder="Username"
              value={username} // Bind to username state
              onChange={(e) => setUsername(e.target.value)} // Update username state
              required
            />
          </div>

          {/* Password Input */}
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

          {/* Forgot Password */}
          <p className="text-[12px] text-center font-medium text-muted-foreground">
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="text-primary underline hover:text-mainColor"
            >
              Click here
            </Link>
          </p>

          {/* Sign Up Link */}
          <p className="text-sm font-medium text-muted-foreground">
            Don&apos;t have an account? &nbsp;
            <Link
              href="/sign-up"
              className="text-primary underline hover:text-mainColor"
            >
              Sign up
            </Link>
          </p>

          {/* Error Message */}
          {error && (
            <div className="error mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full dark:bg-mainColor rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm font-medium text-muted-foreground">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-in Button */}
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
            Sign in with Google
          </button>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden rounded-3xl  md:flex items-center justify-center bg-lightgrey dark:bg-darkgrey shadow-sm p-5">
        <Image
          src="/images/i1.svg"
          width={400}
          height={400}
          alt="Login Illustration"
          className="w-[80%] max-w-sm object-contain dark:filter dark:invert opacity-60"
        />
      </div>
    </div>
  );
}
