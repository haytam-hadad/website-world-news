"use client";
import { useContext, useEffect, useState } from "react";
import { Mail, Bell , Edit } from "lucide-react";
import Article from "./Article";
import Image from "next/image";
import { ThemeContext } from "../ThemeProvider";

const Profile = ({ userData }) => {
  const [articles, setArticles] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useContext(ThemeContext);

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
    <div className="container mx-auto p-3 max-md:p-0">
      {/*Image Banner Section */}
      <div className="relative w-full h-48 mb-3 overflow-hidden rounded-2xl shadow-lg">
        <Image
          src="/images/image.jpg"
          alt="Banner"
          width={1200}
          height={400}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500 ease-in-out"
        />
      </div>

      <div className="bg-lightgrey border dark:bg-darkgrey shadow-sm mb-3 rounded-2xl">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-500 to-indigo-500 p-3 py-2 rounded-2xl shadow-md mb-3">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-14 h-14 max-md:w-12 max-md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground capitalize font-semibold text-xl sm:text-xl md:text-2xl lg:text-3xl shadow-md">
              {userData.username.charAt(0)}
            </div>
            <div className="text-white">
              <h1 className="text-xl sm:text-xl md:text-xl lg:text-2xl font-bold">
                {userData.username || "Unknown"}
              </h1>
              <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-80">
                {userData.email}
              </p>
            </div>
          </div>
           {user && user._id == userData._id ? (
            <button
              className="flex gap-1 items-center bg-white text-blue-600 px-5 py-3 rounded-full shadow-md font-semibold hover:bg-gray-100 transition"
            >
              <Edit/>
              Update Info
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSubscribe();
              }}
              className="flex items-center bg-white text-blue-600 px-5 py-3 rounded-full shadow-md font-semibold hover:bg-gray-100 transition"
            >
              <Bell className="mr-2" />
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}
        </header>

        {/* User Info Section */}
        <section className="p-6">
          <div className="flex items-center mb-4">
            <Mail className="text-blue-500 mr-3" />
            <span className="text-base sm:text-base md:text-base lg:text-xl font-semibold text-primary">
              Email:
            </span>
            <span className="ml-2 text-primary">{userData.email}</span>
          </div>
          <div className="mb-4">
            <span className="text-base sm:text-base md:text-base lg:text-xl font-semibold text-primary">
              Joined :
            </span>
            <span className="ml-2 text-primary">
              {new Date(userData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-base sm:text-base md:text-base lg:text-xl font-semibold text-primary">
              Bio:
            </span>
            <span className="ml-2 text-primary">
              {userData.bio || "No bio available for this user"}
            </span>
          </div>
        </section>
      </div>

      {/* Articles Section */}
      <section>
        <h2 className="title">Articles</h2>
        <div className="">
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
                  url={`/post/${_id}`}
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
