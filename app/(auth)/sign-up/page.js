"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
  })
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // For multi-step form
  const [error, setError] = useState(null)
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toLowerCase() })
    // Clear error for this field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
    setMessage(null)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required."
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required."
    if (!formData.email.trim()) newErrors.email = "Email is required."
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address."
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required."
    if (!formData.password) newErrors.password = "Password is required."
    if (formData.password && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters."
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match."
    if (!formData.birthdate) newErrors.birthdate = "Birthdate is required."
    return newErrors
  }

  const validateStep = (currentStep) => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required."
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required."
      if (!formData.email.trim()) newErrors.email = "Email is required."
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address."
    } else if (currentStep === 2) {
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required."
      if (!formData.birthdate) newErrors.birthdate = "Birthdate is required."
    } else if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required."
      if (formData.password && formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters."
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match."
    }

    return newErrors
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    } catch (err) {
      setError(err.message || "An unexpected error occurred with Google login.")
      setLoading(false)
    }
  }

  const handleNextStep = () => {
    const stepErrors = validateStep(step)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setStep(step + 1)
    setErrors({})
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setLoading(true)
    try {
      const formDataToSend = {
        username: `${formData.firstName.trim()}.${formData.lastName.trim()}`,
        displayname: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        birthdate: formData.birthdate,
      }

      console.info("Sending Sign Up Data:", formDataToSend)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setErrors({ api: data?.message || "Signup failed." })
        return
      }

      console.log("Signup Response:", data)

      setMessage("Signup successful!")

      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          birthdate: "",
        })

        router.push("/login")
      }, 200)
    } catch (err) {
      console.error("Error during signup:", err)
      setErrors({ api: "An unexpected error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Form Section */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image src="/images/i1.svg" width={60} height={60} alt="Logo" className="dark:filter dark:invert" />
            </motion.div>
            <motion.h2
              className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create your account
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join our community and start sharing news
            </motion.p>
          </div>

          <motion.div
            className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step indicators */}
              <div className="flex justify-between mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-1/3 h-1 rounded-full mx-1 transition-colors duration-300 ${
                      i === step ? "bg-mainColor" : i < step ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="birthdate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Birthdate
                    </label>
                    <input
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.birthdate ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.birthdate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.birthdate}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Security */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security</h3>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"} px-3 py-2.5 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor text-sm bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* API Error Message */}
              {errors.api && (
                <motion.div
                  className="p-3 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {errors.api}
                </motion.div>
              )}

              {/* Success Message */}
              {message && (
                <motion.div
                  className="p-3 text-sm bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg flex items-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {message}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain flex spacing
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-colors duration-200"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-mainColor rounded-lg hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-colors duration-200 disabled:opacity-70 flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Alternative Sign-up Options */}
            <div className="mt-6">
              <Link
                href="/terms-of-use"
                className="hover:text-gray-700 text-mainColor dark:hover:text-gray-300 transition-colors focus:outline-none rounded"
              >
                Terms of use
              </Link>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-600 transition-colors duration-200 disabled:opacity-70"
                >
                  <Image
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    width={20}
                    height={20}
                    alt="Google logo"
                  />
                  Sign in with Google
                </button>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-mainColor hover:text-mainColor/80 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-mainColor to-sky-500 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-white max-w-md"
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg mb-8 text-white/90">
              Create an account to share news, engage with other readers, and customize your news experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative w-full max-w-md aspect-square"
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src="/images/i1.svg"
                width={300}
                height={300}
                alt="Logo Animation"
                className="filter invert opacity-80"
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/20 blur-md"
              animate={{
                y: [0, 15, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-sky-300/30 blur-md"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

