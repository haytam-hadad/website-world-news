import Article from "./components/Article";
import { ChevronDown } from "lucide-react";

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
      <div className="bg-gradient-to-r shadow-lg from-mainColor to-purple-700 mt-5 py-12 px-6 rounded-lg m-1 mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 text-center sm:text-left lg:text-3xl xl:text-4xl">
          Welcome to the World of News!
        </h1>
        <div className="bg-white w-40 h-1 scale-75 rounded-md inline-block mb-2 p-1"></div>

        <p className="text-lg text-white mb-4 text-center sm:text-left lg:text-lg xl:text-xl">
          Stay updated with the latest news from around the globe. Explore, learn, and stay informed. Your source for the most reliable news!
        </p>
        <button className="border bg-white shadow-3lg text-purple-700 py-2 px-6 sm:px-4 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition w-full sm:w-auto">
          Explore Latest News <ChevronDown className="inline-block ml-2" />
        </button>
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
                key={_id || Math.random().toString(36)}
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
