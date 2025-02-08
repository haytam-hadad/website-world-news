import Article from "@/app/components/Article";
import { ChevronDown } from "lucide-react";

const fetchArticlesByCategory = async (category) => {
  try {
    const apiUrl = `http://localhost:5000/api/news/category/${category}`;

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

const Category = async ({ params }) => {
  const { category } = await params;
  const articles = await fetchArticlesByCategory(category);

  return (
    <div>
      {articles.length > 0 && (
        <h2 className="title">
          Top {category} Headlines <ChevronDown className="ml-2 inline-block" />
        </h2>
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
                publishedAt={publishedAt && !isNaN(new Date(publishedAt)) ? new Date(publishedAt).toLocaleString() : "N/A"}
                category={category}
                url={url}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Category;
