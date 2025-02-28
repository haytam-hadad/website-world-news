import Article from "./components/Article";
import { ChevronDown } from "lucide-react";
import Welcome from "./components/Welcome";
import Link from "next/link";



const fetchArticles = async () => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/latest`;

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
      <Welcome/>

      {/* Articles Section */}
      <h2 className="title">
      Latest News <ChevronDown className="ml-2 inline-block" />
      </h2>

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2 ">
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
    </>
  );
}

