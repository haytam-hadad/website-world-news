import Article from './Article.jsx';
import { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/MoonLoader.js";

// const timeAgo = (publishedDate) => {
//   const now = new Date();
//   const published = new Date(publishedDate);
//   if (published > now) return "In the future";

//   const diffInSeconds = Math.floor((now - published) / 1000);
//   const minutes = Math.floor(diffInSeconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   const months = Math.floor(days / 30.44);
//   const years = Math.floor(days / 365.25);

//   if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
//   if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
//   if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
//   if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
//   if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

//   return "Just now";
// };

const Articles = ({ apiKey, categState, language, dosearch, setDosearch, search }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(`/api/v2/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`);

  useEffect(() => {
    setUrl(`/api/v2/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`);
  }, [categState, language, apiKey]);

  useEffect(() => {
    if (dosearch && search) {
      setUrl(`/api/v2/everything?q=${encodeURIComponent(search)}&language=${language}&apiKey=${apiKey}`);
      setDosearch(false);
    }
  }, [dosearch, search, language, apiKey]);

  const fetchNews = async (fetchUrl) => {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(url);
  }, [url]);

  return (
    <main>
      {loading ? (
        <ClipLoader className="spinner" color={"#fff"} loading={true} size={40} />
      ) : articles.length > 0 ? (
        articles.map((article, index) => (
          <Article
            key={index}
            source={article.source.name}
            publishedAt={new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(article.publishedAt))}
            urlToImage={article.urlToImage}
            title={article.title}
            description={article.description}
            url={article.url}
            author={article.author}
          />
        ))
      ) : (
        <div className="no_articles_container">
          <h1 className="no_articles"> `{search}` -- language: `{language}`</h1>
          <h1 className="no_articles">No articles available.</h1>
        </div>
      )}
    </main>
  );
};

export default Articles;
