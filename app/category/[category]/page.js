import Article from "@/app/components/Article";
import { ChevronDown } from "lucide-react";

const Category = async ({ params }) => {
  const { category } = params;
  let articles = [];

  const fetchNews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/category/${category}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      articles = data || [];
      console.log(`Fetched articles for category: ${category}`, articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  await fetchNews();

  return (
    <div>
      {articles.length > 0 && (
          <h2 className="title">
              Top {category} Headlines <ChevronDown className="ml-2 inline-block" />
          </h2>
      )}

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2 ">
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
              category={article.category || category}
            />
          ))
        ) : (
          <div className="no_articles_container">
            <h1 className="no_articles">
              No articles in this category &quot;<b>{category}</b>&quot; available
            </h1>
          </div>
        )}
      </main>
    </div>
  );
};

export default Category;
