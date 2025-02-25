"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setMessage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password && formData.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: `${formData.firstName.trim()}.${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        birthdate: formData.birthdate,
      };

      console.info("Sending Sign Up Data:", formDataToSend);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors({ api: data?.message || 'Signup failed.' });
        return;
      }

      console.log("Signup Response:", data);

      setMessage("Signup successful!");

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          birthdate: '',
        });

        router.push('/login');
      }, 200);

    } catch (err) {
      console.error('Error during signup:', err);
      setErrors({ api: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_2fr]">
      <div className="flex mt-10 flex-col justify-center px-3">
        <form className="flex flex-col space-y-5 max-w-lg mx-auto w-full" onSubmit={handleSubmit}>
          <h1 className="text-center text-4xl font-bold text-foreground mb-6">Sign up</h1>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">First Name</span>
            <input type="text" className="form_input" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required aria-label="First Name" />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Last Name</span>
            <input type="text" className="form_input" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required aria-label="Last Name" />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Phone Number</span>
            <input type="tel" className="form_input" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required aria-label="Phone Number" />
            {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Email</span>
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
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Password</span>
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
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Confirm Password</span>
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
            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
          </label>
          <label className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Birthdate</span>
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
            {errors.birthdate && <span className="text-red-500 text-sm">{errors.birthdate}</span>}
          </label>
          {message && <div className="text-green-500 text-sm">{message}</div>}
          {errors.api && (
            <div className="error mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
              {errors.api}
            </div>
          )}
          <button
            type="submit"
            className={`w-full dark:bg-mainColor rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>

          <span className="text-sm font-medium text-muted-foreground">
            Already have an account? &nbsp;
            <Link href="/login" className="text-primary underline hover:text-mainColor">Log in</Link>
          </span>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-sm font-medium text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

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
