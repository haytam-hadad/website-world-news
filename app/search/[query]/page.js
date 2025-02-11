import Article from "@/app/components/Article";
import { ChevronDown } from "lucide-react";

export const metadata = {
  title: "Search for News",
  description: "Search for news articles",
};

const fetchSearchResults = async (query) => {
  try {
    if (!query) return [];

    const apiUrl = `http://localhost:5000/api/news/search/${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch search results: ${res.status} ${res.statusText}`);
    }

    const articles = await res.json();
    console.log('Search results:', articles); // Debug log
    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

const Search = async ({ params }) => {
  const { query } = await params;
  const articles = await fetchSearchResults(query);

  return (
    <div>
      {articles.length > 0 ? (
        <h2 className="title">
          Search Results for &nbsp; <u>{query}</u>
          <ChevronDown className="ml-2 inline-block" />
        </h2>
      ) : (
        <div className="no_articles_container">
          <h1 className="no_articles">
            No results found for &quot;<b>{query}</b>&quot;
          </h1>
        </div>
      )}

<main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2">
        {articles.length === 0 ? (
          <div className="no_articles_container">
            <h1 className="no_articles">
              No articles in this category &quot;<b>{category}</b>&quot; available
            </h1>
          </div>
        ) : (
          articles.map((article) => {
            const {
              _id,
              title = "No title available",
              content = "No content available",
              imageUrl = "/images/default.jpg",
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
                publishedAt={publishedAt}
                category={category}
                url={"/post/"+_id}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Search;
