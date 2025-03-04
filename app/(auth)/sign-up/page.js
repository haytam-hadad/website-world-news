"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toLowerCase() });
    setErrors({});
    setMessage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.birthdate) newErrors.birthdate = "Birthdate is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = {
        username: `${formData.firstName.trim()}.${formData.lastName.trim()}`,
        displayname: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        birthdate: formData.birthdate,
      };

      console.info("Sending Sign Up Data:", formDataToSend);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors({ api: data?.message || "Signup failed." });
        return;
      }

      console.log("Signup Response:", data);

      setMessage("Signup successful!");

      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          birthdate: "",
        });

        router.push("/login");
      }, 200);
    } catch (err) {
      console.error("Error during signup:", err);
      setErrors({ api: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[4fr_2fr] overflow-x-hidden">
      <div className="flex flex-col justify-center">
        <form
          className="flex flex-col space-y-3 p-5 sm:p-10 rounded-xl dark:bg-black border shadow-sm bg-secondaryColor max-w-xl mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-4xl p-1 font-bold text-foreground mb-6">
            Sign up
          </h1>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">First Name</span>
            <input
              type="text"
              className="form_input"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              aria-label="First Name"
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Last Name</span>
            <input
              type="text"
              className="form_input"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              aria-label="Last Name"
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Phone Number</span>
            <input
              type="tel"
              className="form_input"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              aria-label="Phone Number"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Email</span>
            <input
              type="email"
              className="form_input"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Password</span>
            <input
              type="password"
              className="form_input"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-label="Password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Confirm Password</span>
            <input
              type="password"
              className="form_input"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              aria-label="Confirm Password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-primary">Birthdate</span>
            <input
              type="date"
              className="form_input"
              name="birthdate"
              placeholder="Birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              aria-label="Birthdate"
            />
            {errors.birthdate && (
              <span className="text-red-500 text-sm">{errors.birthdate}</span>
            )}
          </label>
          {message && <div className="text-green-500 text-sm">{message}</div>}
          {errors.api && (
            <div className="error mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
              {errors.api}
            </div>
          )}
          <button
            type="submit"
            className="main_btn"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <span className="text-sm font-medium text-muted-foreground">
            Already have an account? &nbsp;
            <Link
              href="/login"
              className="text-primary underline hover:text-mainColor"
            >
              Log in
            </Link>
          </span>

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
            className="max-w-sm m-auto scale-110 object-contain dark:filter dark:invert opacity-90"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
