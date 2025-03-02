"use client";
import { useState, useEffect, useContext } from "react";
import { Edit } from "lucide-react";
import { ThemeContext } from "../../ThemeProvider";

const UserDashboard = () => {
  const { user, setUser } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userprofile?username=${user.username}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <p>Loading user data...</p>;
  if (!userData) return <p>Error loading user data.</p>;

  return (
    <div className="max-w-4xl border mx-auto p-1 sm:p-3 rounded-lg">
      <h1 className="text-2xl font-bold text-center bg-mainColor text-white p-3 mb-4 rounded-xl">Dashboard</h1>
      <div className="flex p-2 bg-white dark:bg-darkgrey rounded-xl border mb-3 text-center flex-col justify-center items-center space-y-1 md:space-y-0 md:flex-row md:space-x-3">
        <div className="w-14 h-14 font-semibold rounded-full text-2xl bg-mainColor text-bold text-white flex items-center justify-center">
          {user.displayname.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-lg p-1 font-semibold text-primary">
            {user?.displayname || "User"}{" "}
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              @{user?.username}
            </p>
          </h2>
        </div>
      </div>
      <div className="rounded-xl p-3">
        <div className="space-y-4">
          {[
            { label: "Profile Name", type: "text", value: userData.displayname, key: "displayname" },
            { label: "Email", type: "email", value: userData.email, key: "email" },
            { label: "Bio", type: "textarea", value: userData.bio, key: "bio" },
            { label: "Phone", type: "tel", value: userData.phone, key: "phone" },
            { label: "Website", type: "url", value: userData.website, key: "website" },
            { label: "Country", type: "text", value: userData.country, key: "country" },
            { label: "City", type: "text", value: userData.city, key: "city" },
            { label: "Zip Code", type: "text", value: userData.zipCode, key: "zipCode" },
            { label: "Birthdate", type: "date", value: userData.birthdate, key: "birthdate" },
          ].map(({ label, type, value, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2">{label}</label>
              {type === "textarea" ? (
                <textarea
                  className="form_input"
                  value={value || ""}
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                ></textarea>
              ) : (
                <input
                  type={type}
                  className="form_input"
                  value={value || ""}
                  onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold mb-2">Gender</label>
            <select
              className="form_input"
              value={userData.gender || ""}
              onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
            >
              <option value="">Select a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button className="flex gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <Edit /> Update Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

