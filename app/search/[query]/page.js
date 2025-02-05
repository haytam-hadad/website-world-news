import Article from "@/app/components/Article";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: "Search for News",
  description: "Search for news articles",
};

const Search = async ({ params }) => {
  const { query } = params; // Get search query from the path
  let articles = [];

  const fetchNews = async () => {
    try {
      if (!query) return;

      const response = await fetch(`http://localhost:5000/api/news/search/${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      articles = data || [];
      console.log(`Fetched articles for search: "${query}"`, articles);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  await fetchNews();

  return (
    <div>
      {articles.length > 0 && (
        <h2 className="text-2xl text-primary font-bold tracking-wide pl-10 py-2 rounded-full my-4 text-center md:text-left">
          <span className="flex items-center justify-center">
            Search Results for &nbsp; <u> {query}</u>
            <ChevronDown className="ml-2 inline-block" />
          </span>
        </h2>
      )}

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <Article
              key={index}
              title={article.title}
              source={article.source_name || "Unknown Source"}
              timeAgo={article.timeago || "N/A"}
              urlToImage={article.urlToImage || "/images/default.jpg"}
              description={article.description || "No description available"}
              url={article.url || "#"}
              author={article.author || "Unknown"}
            />
          ))
        ) : (
          <div className="no_articles_container">
            <h1 className="no_articles">
              No results found for &quot;<b>{query}</b>&quot;
            </h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
