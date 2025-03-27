"use client"
import { useState, useEffect, useContext, useRef } from "react"
import { Edit, Save, User, Mail, Phone, Globe, Info, Cake, AlertCircle, Upload, Camera, X, Loader2 } from "lucide-react"
import { ThemeContext } from "../../ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const UserDashboard = () => {
  const { user, setUser } = useContext(ThemeContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadType, setUploadType] = useState(null) // 'profile' or 'banner'
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Refs for file inputs
  const profilePictureInputRef = useRef(null)
  const profileBannerInputRef = useRef(null)

  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userprofile?username=${user.username}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error("Failed to fetch user data")
        const data = await res.json()

        // Ensure we're using the database values for profile picture and banner
        setUserData({
          ...data,
          // Make sure we prioritize the profilePicture field from the database
          profilePicture: data.profilePicture,
          // Ensure we're using the profileBanner from the database
          profileBanner: data.profileBanner || "",
        })
      } catch (err) {
        console.error("Error fetching user data:", err)
        setErrorMessage("Failed to load user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "North Korea",
    "South Korea",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ]

  // Updated validateForm function in page.js
  const validateForm = () => {
    const errors = {}

    // Email validation
    if (!userData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Username validation
    if (!userData.username) {
      errors.username = "Username is required"
    } else if (userData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9._-]+$/.test(userData.username)) {
      errors.username = "Username can only contain letters, numbers, and ._-"
    }

    // Website validation (if provided)
    if (userData.website && !isValidUrl(userData.website)) {
      errors.website = "Please enter a valid URL"
    }

    // Phone validation (if provided)
    if (userData.phone && !isValidPhone(userData.phone)) {
      errors.phone = "Please enter a valid phone number"
    }

    return errors
  }

  // Helper functions
  const isValidUrl = (url) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`)
      return true
    } catch (e) {
      return false
    }
  }

  const isValidPhone = (phone) => {
    // Basic phone validation - can be improved
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)
  }

  // Handle file selection
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size should be less than 5MB")
      return
    }

    setSelectedImage(file)
    setImagePreview(URL.createObjectURL(file))
    setUploadType(type)
    setShowImageModal(true)
  }

  // Upload image to Cloudinary
  const uploadToCloudinary = async () => {
    if (!selectedImage) return;
  
    setUploadingImage(true);
    setUploadProgress(0);
  
    // Ensure required env variables are set
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary environment variables are missing.");
      setErrorMessage("Configuration error. Please check your environment variables.");
      setUploadingImage(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", uploadPreset); // No need to include API key
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
  
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
  
      xhr.onload = () => {
        setUploadingImage(false);
        setUploadProgress(0);
  
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
  
          // Handle different upload types
          setUserData((prev) => {
            if (uploadType === "profile") {
              return { ...prev, picture: response.secure_url, profilePicture: response.secure_url };
            } else if (uploadType === "banner") {
              return { ...prev, profileBanner: response.secure_url };
            }
            return prev;
          });
  
          setShowImageModal(false);
          setSelectedImage(null);
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
        } else {
          console.error("Upload failed:", xhr.responseText);
          setErrorMessage("Failed to upload image. Please try again.");
        }
      };
  
      xhr.addEventListener("error", () => {
        console.error("Upload error");
        setErrorMessage("Upload failed due to a network error.");
        setUploadingImage(false);
        setUploadProgress(0);
      });
  
      xhr.send(formData);
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setUploadingImage(false);
    }
  };
  

  // Cancel image upload
  const cancelImageUpload = () => {
    setShowImageModal(false)
    setSelectedImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    setUploadType(null)
  }

  const handleSave = async () => {
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setSaving(true)
    setErrorMessage("")

    try {
      if (!userData) {
        throw new Error("User data is undefined!")
      }

      // Prepare data to send to API
      const dataToSend = {
        username: userData.username,
        displayname: userData.displayname,
        email: userData.email,
        phone: userData.phone || "",
        website: userData.website || "",
        bio: userData.bio || "",
        birthdate: userData.birthdate ? new Date(userData.birthdate).toISOString().split("T")[0] : "",
        gender: userData.gender || "",
        country: userData.country || "",
        city: userData.city || "",
        zipCode: userData.zipCode || "",
        profilePicture: userData.profilePicture || "",
        profileBanner: userData.profileBanner || "",
      }

      console.log("Data being sent:", dataToSend)

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userprofile/changeinformation`
      console.log("API URL:", apiUrl)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Received non-JSON response:", text)
        throw new Error("Server returned an invalid response")
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile")
      }

      setSuccessMessage(result.message || "User Information Updated!")
      setEditMode(false)

      // Update user context if username or profile picture changed
      if (userData.username !== user.username || userData.profilePicture !== user.picture) {
        setUser({
          ...user,
          username: userData.username,
          displayname: userData.displayname,
          picture: userData.profilePicture || userData.picture,
        })
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setErrorMessage(err.message || "Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear validation error for this field when user types
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: null,
      })
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainColor"></div>
      </div>
    )

  if (!userData)
    return (
      <div className="max-w-4xl p-6 mx-auto bg-white dark:bg-darkgrey rounded-xl shadow-md">
        <p className="text-center text-red-500 font-medium">Error loading user data. Please try again later.</p>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl p-6 mx-auto"
    >
      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={cancelImageUpload}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-darkgrey rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {uploadType === "profile" ? "Update Profile Picture" : "Update Banner Image"}
                </h3>
                <button
                  onClick={cancelImageUpload}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                {uploadType === "profile" ? (
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                    <Image
                      src={imagePreview || userData?.profilePicture || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
                    />
                  </div>
                )}
              </div>

              {uploadingImage ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-mainColor h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={cancelImageUpload}
                    className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadToCloudinary}
                    className="flex-1 py-2 px-4 bg-mainColor hover:bg-mainColor/90 text-white rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorMessage}
        </motion.div>
      )}

      <div className="bg-white dark:bg-darkgrey shadow-md rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile Banner */}
        <div className="relative h-36 sm:h-40 bg-gray-300 dark:bg-gray-800 overflow-hidden">
          {userData.profileBanner ? (
            <Image
              src={userData.profileBanner || "/placeholder.svg"}
              alt="Profile Banner"
              className="w-full h-full object-cover"
              width={1200}
              height={300}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-mainColor/30 to-mainColor/70 flex items-center justify-center">
              <span className="text-white font-bold text-lg">No banner image</span>
            </div>
          )}

          {/* Banner upload button */}
          {editMode && (
            <div className="absolute bottom-4 right-4">
              <input
                type="file"
                ref={profileBannerInputRef}
                onChange={(e) => handleFileSelect(e, "banner")}
                accept="image/*"
                className="hidden"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="flex items-center gap-2 px-3 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{userData.profileBanner ? "Change Banner" : "Add Banner"}</span>
              </label>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-darkgrey shadow-md">
                {userData.profilePicture ? (
                  <Image
                    src={userData.profilePicture || "/placeholder.svg"}
                    alt={userData.displayname}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-mainColor text-white flex items-center justify-center text-2xl font-bold">
                    {userData.displayname?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Profile picture upload button */}
              {editMode && (
                <div className="absolute -bottom-1 -right-1">
                  <input
                    type="file"
                    ref={profilePictureInputRef}
                    onChange={(e) => handleFileSelect(e, "profile")}
                    accept="image/*"
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center justify-center w-8 h-8 bg-mainColor hover:bg-mainColor/90 text-white rounded-full cursor-pointer transition-colors shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{userData.displayname || "User"}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{userData.username}</p>
            </div>
          </div>
          <button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            disabled={saving || uploadingImage}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-mainColor hover:bg-mainColor/90 text-white"
            } ${saving || uploadingImage ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : editMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-mainColor" />
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Name</label>
                {editMode ? (
                  <input
                    type="text"
                    className="w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.displayname || ""}
                    onChange={(e) => handleChange("displayname", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.displayname || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" /> Email
                </label>
                {editMode ? (
                  <div>
                    <input
                      type="email"
                      className={`w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border ${
                        validationErrors.email
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
                      value={userData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.email || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" /> Phone
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    className="w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.phone || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                {editMode ? (
                  <textarea
                    className="w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors min-h-[100px]"
                    value={userData.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                  ></textarea>
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[100px]">
                    {userData.bio || "No bio provided"}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-mainColor" />
                Additional Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" /> Website
                </label>
                {editMode ? (
                  <input
                    type="url"
                    className="w-full p-3 text-primary rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.website ? (
                      <a
                        href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mainColor hover:underline"
                      >
                        {userData.website}
                      </a>
                    ) : (
                      "Not set"
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" /> Zip Code
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="w-full p-3 text-primary rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.zipCode || ""}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.zipCode || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" /> Country
                </label>
                {editMode ? (
                  <select
                    className="w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.country || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" /> City
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="w-full p-3 text-primary rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.city || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Cake className="w-4 h-4 inline mr-1" /> Birthdate
                </label>
                {editMode ? (
                  <input
                    type="date"
                    className="w-full p-3 text-primary rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                    value={userData.birthdate ? new Date(userData.birthdate).toISOString().split("T")[0] : ""}
                    onChange={(e) => handleChange("birthdate", e.target.value)}
                  />
                ) : (
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {userData.birthdate ? new Date(userData.birthdate).toLocaleDateString() : "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
            {editMode ? (
              <select
                className="w-full text-primary p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                value={userData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select a gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="U">Prefer not to say</option>
              </select>
            ) : (
              <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                {userData.gender ? (
                  <span className="capitalize">
                    {userData.gender === "M" ? "Male" : userData.gender === "F" ? "Female" : "Prefer not to say"}
                  </span>
                ) : (
                  "Not specified"
                )}
              </div>
            )}
          </div>

          {/* Cancel Button (only in edit mode) */}
          {editMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setEditMode(false)
                  setValidationErrors({})
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mr-3"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserDashboard

