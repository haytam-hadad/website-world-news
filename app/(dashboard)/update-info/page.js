"use client"
import { useState, useEffect, useContext } from "react"
import { Edit, Save, User, Mail, Phone, Globe, Info, Cake, AlertCircle } from "lucide-react"
import { ThemeContext } from "../../ThemeProvider"
import { motion } from "framer-motion"

const UserDashboard = () => {
  const { user, setUser } = useContext(ThemeContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userprofile?username=${user.username}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error("Failed to fetch user data")
        const data = await res.json()
        setUserData(data)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setErrorMessage("Failed to load user data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

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
    "Zimbabwe"];

  const validateForm = () => {
    const errors = {}

    // Email validation
    if (!userData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Username validation (if changed)
    if (userData.username && userData.username !== user.username) {
      if (userData.username.length < 3) {
        errors.username = "Username must be at least 3 characters"
      } else if (!/^[a-zA-Z0-9._-]+$/.test(userData.username)) {
        errors.username = "Username can only contain letters, numbers, and ._-"
      }
    }

    return errors
  }

  const handleSave = async () => {
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  
    setValidationErrors({});
    setSaving(true);
    setErrorMessage("");
  
    try {
      if (!userData) {
        throw new Error("User data is undefined!");
      }
  
      // Prepare data to send to API
      const dataToSend = {
        username: userData.username || "",
        displayname: userData.displayname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        website: userData.website || "",
        bio: userData.bio || "",
        birthday: userData.birthday || "",
        gender: userData.gender || "",
        country: userData.country || "",
        city: userData.city || "",
        zipCode: userData.zipCode || "",
      };
  
      console.log("Data being sent:", dataToSend);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userprofile/changeinformation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });
  
      const responseText = await response.text(); // Read raw response for debugging
      console.log("Raw API Response:", responseText);
  
      if (!response.ok) {
        let errorMessage = "Failed to update profile";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
        }
        throw new Error(errorMessage);
      }
  
      const result = JSON.parse(responseText);
      setSuccessMessage(result?.message || "User Information Updated!");
      setEditMode(false);
  
      // Update user context if username changed
      if (userData.username !== user.username) {
        setUser({
          ...user,
          username: userData.username,
        });
      }
  
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage(err?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  

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
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-mainColor text-white flex items-center justify-center text-2xl font-bold">
              {userData.displayname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{userData.displayname || "User"}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{userData.username}</p>
            </div>
          </div>
          <button
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              editMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-mainColor hover:bg-mainColor/90 text-white"
            } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">{userData.displayname || "Not set"}</div>
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
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">{userData.email || "Not set"}</div>
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
                  <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">{userData.phone || "Not set"}</div>
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
                  value={userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : ""}
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            ) : (
              <div className="p-3 text-primary bg-gray-50 dark:bg-gray-800 rounded-lg">
                {userData.gender ? <span className="capitalize">{userData.gender}</span> : "Not specified"}
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






