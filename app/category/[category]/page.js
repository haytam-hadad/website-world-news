import Article from "@/app/components/Article";
import { ChevronDown } from "lucide-react";

const fetchArticlesByCategory = async (category) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/category/${category}`;

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
          articles.map((article , i) => {
            return (
              <Article
                key={i}
                articleData={article}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Category;
