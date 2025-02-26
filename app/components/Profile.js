"use client";
import { useContext, useEffect, useState } from "react";
import { Bell, Edit, Star ,Mail } from "lucide-react";
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
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-mainColor to-[skyblue] p-3 lg:px-5 rounded-2xl mb-1">
          <div className="flex items-center space-x-4 mb-3 md:mb-0">
            <div className="w-14 h-14 max-md:w-12 max-md:h-12 rounded-full bg-primary-foreground flex items-center justify-center text-primary capitalize font-semibold text-xl sm:text-xl md:text-2xl lg:text-3xl shadow-md">
              {userData.displayname?.charAt(0) || "U"}
            </div>
            <div className="text-white">
              <h1 className="text-lg capitalize sm:text-lg md:text-xl lg:text-xl font-bold">
                {userData.displayname || "Unknown"}
              </h1>
              <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-80">
                {userData.email}
              </p>
              <p className="text-sm sm:text-base md:text-base lg:text-lg opacity-80 font-semibold">
                Trust Rating: {userData.trustRating || "N/A"}
              </p>
            </div>
          </div>
          {user && user._id == userData._id ? (
            <button className="flex gap-1 items-center bg-white text-mainColor px-5 py-3 rounded-full shadow-md font-semibold hover:bg-gray-100 transition">
              <Edit />
              Update Info
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSubscribe();
              }}
              className="flex items-center bg-white text-mainColor px-5 py-3 rounded-full shadow-md font-semibold hover:bg-gray-100 transition"
            >
              <Bell className="mr-2" />
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}
        </header>

        {/* User Info Section */}
        <section className="p-6 bg-lightgrey dark:bg-darkgrey rounded-2xl">
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

