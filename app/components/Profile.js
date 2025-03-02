"use client";
import { useContext, useEffect, useState } from "react";
import { Bell, Edit, Star, Mail, Plus } from "lucide-react";
import Article from "./Article";
import Image from "next/image";
import { ThemeContext } from "../ThemeProvider";
import Link from "next/link";

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
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${username}`
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
      {user && user._id == userData._id ? (
        <div className="relative w-full sm:h-36 h-28 mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-mainColor to-[#3498db48] flex items-center justify-center">
          <button
            type="button"
            className="flex gap-1 bg-primary-foreground text-primary px-5 py-3 font-semibold rounded-full hover:bg-primary-foreground/90 shadow-lg"
          >
            <Plus /> Add Banner
          </button>
        </div>
      ) : (
        <div className="relative w-full h-5 opacity-0 mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-mainColor to-[#3498db1d] flex items-center justify-center">
        </div>
      )}

      <div className="bg-white border dark:bg-darkgrey shadow-sm mb-3 rounded-2xl">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-mainColor to-[skyblue] p-3 lg:px-5 rounded-2xl mb-1 gap-1">
          <div className="flex items-center space-x-4 mb-3 md:mb-0">
            <div className="w-14 h-14 max-md:w-12 max-md:h-12 rounded-full bg-primary-foreground flex items-center justify-center text-primary capitalize font-semibold text-xl sm:text-xl md:text-2xl lg:text-3xl shadow-md">
              {userData.displayname?.charAt(0) || "U"}
            </div>
            <div className="text-white">
              <h1 className="text-lg capitalize sm:text-lg md:text-xl lg:text-xl font-bold">
                {userData.displayname || "Unknown"}
              </h1>
              <p className="text-sm md:text-md opacity-70 font-semibold">
                 {"@"+userData.username || "N/A" }
              </p>
            </div>
          </div>
          {user && user._id == userData._id ? (
            <Link href="/update-info" className="flex gap-1 items-center font-bold bg-white text-mainColor px-4 py-3 rounded-full shadow-md hover:bg-gray-100 transition">
                <Edit />
                Update Info
              
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSubscribe();
              }}
              className={`p-2 px-4 max-sm:p-2 outline outline-offset-2 outline-2 bg-mainColor outline-white max-sm:px-3 rounded-full font-bold text-sm transition-all ${
                subscribed ? "bg-secondaryColor text-black" : "text-secondaryColor"
              }`}
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}
        </header>

        {/* User Info Section */}
        <section className="p-6 bg-white dark:bg-darkgrey rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-center pb-3">
              <Mail className="text-mainColor mr-3" />
              <p className="text-base font-semibold text-primary">
                Email: {userData.email}
              </p>
            </div>
            <div className="flex items-center py-3">
              <Star className="text-mainColor mr-3" />
              <p className="text-base font-semibold text-primary">
                Joined: {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-start py-3">
              <p className="text-base font-semibold text-primary">Bio:</p>
              <p className="ml-2 text-primary">
                {userData.bio || "No bio available for this user"}
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-5">
        <h2 className="title">Articles</h2>
        <div className="space-y-5">
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

