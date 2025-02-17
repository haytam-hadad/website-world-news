"use client";
import { useEffect, useState } from "react";
import { Mail, Bell } from "lucide-react"; // Importing the icons
import Article from "./Article"; // Ensure this import points to where your Article component is located.
import Image from "next/image";


const Profile = ({ userData }) => {
  const [articles, setArticles] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  const toggleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  useEffect(() => {
    const fetchArticles = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/articles/${username}`
        );

        if (!response.ok) throw new Error("Failed to fetch articles");

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    if (userData) {
      fetchArticles(userData.username);
    }
  }, [userData]);

  return (
    <div className="profile p-6 rounded-lg">
      {/* Image Banner Section */}
      <div className="relative w-full h-48 bg-gray-200 mb-3">
        <Image
          src="/images/image.jpg" // Replace with your desired banner image URL
          alt="Banner"
          width={1200}
            height={400}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Header Section */}
      <header className="flex items-center justify-between bg-gradient-to-r from-mainColor via-mainColor to-[skyblue] p-3 px-4 rounded-lg shadow-md mb-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gray-800 w-14 h-14 flex items-center justify-center text-white font-bold text-xl">
            {userData.username.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-2xl text-white font-semibold">{userData.username || "Unknown"}</span>
            <span className="text-sm p-1 text-gray-200">{userData.email}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSubscribe();
          }}
          className={`p-3 px-4 rounded-full shadow-md text-sm font-semibold transition-all ${
            subscribed
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          <Bell className="inline mr-2" /> {/* Bell icon added */}
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </header>

      {/* User Info Section */}
      <div className="user-info mb-8 p-3 border-gray-300 rounded-lg shadow-sm">
        <p className="p-2 text-primary">
          <Mail className="inline mr-2" /> {/* Mail icon added */}
          <strong>Email:</strong> {userData.email}
        </p>
        <p className="p-2 text-primary">
          <strong>Account Created:</strong> {new Date(userData.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Articles Section */}
      <h2 className="text-2xl font-semibold text-primary mb-6">Articles</h2>
      <main className="gap-3 max-w-full">
        {articles.length === 0 ? (
          <p className="text-gray-500">No articles available.</p>
        ) : (
          articles.map((article) => {
            const {
              _id,
              title = "No title available",
              content = "No content available",
              imageUrl = "/images/image.jpg",
              author = "Unknown",
              publishedAt,
              category = "General",
              url = "#",
            } = article || {};

            return (
              <Article
                key={_id}
                title={title}
                desc={content}
                imageUrl={imageUrl}
                author={author}
                publishedAt={publishedAt}
                category={category}
                url={`/post/${_id}`} // Using dynamic URL based on article ID
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Profile;
