import Article from "./components/Article";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const fetchArticles = async () => {
  try {
    const apiUrl = "http://localhost:5000/api/news/latest";
    
    if (!apiUrl) throw new Error("API URL is not defined in environment variables");

    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
    }

    const articles = await res.json();
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export default async function Home() {
  const articles = await fetchArticles();

  return (
    <>
      <div className="bg-gradient-to-r from-mainColor via-mainColor to-[skyblue] my-3 py-12 px-8 sm:px-6 rounded-lg flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-extrabold text-white mb-4 sm:text-3xl xl:text-4xl leading-tight">
          Welcome to Your News Feed
        </h1>
        <p className="text-lg text-white mb-6 sm:text-xl xl:text-2xl max-w-xl">
          Discover, share, and engage with news from across the globe. Be the journalist, share your voice, and stay informed.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <button className="bg-white text-mainColor cursor-default transition-all px-6 py-3 rounded-lg font-semibold shadow-lg w-full sm:w-auto">
            Explore Latest News <ChevronDown className="inline-block ml-2" />
          </button>
          <Link href="/login">
            <button className="border-2 shadow-lg border-white text-white hover:bg-white hover:text-mainColor transition-all px-6 py-3 rounded-lg font-semibold w-full sm:w-auto">
              Log in to be part of the conversation
            </button>
          </Link>
        </div>
      </div>



      {/* Articles Section */}
      <h2 className="title">
      Latest News <ChevronDown className="ml-2 inline-block" />
      </h2>

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2 ">
        {articles.length === 0 ? (
          <p>No articles available.</p>
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
                publishedAt={publishedAt && !isNaN(new Date(publishedAt)) ? new Date(publishedAt).toLocaleString() : "N/A"}
                category={category}
                url={url}
              />
            );
          })
        )}
      </main>
    </>
  );
}
