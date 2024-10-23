import Article from './Article.jsx';
import { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/MoonLoader.js";

const timeAgo = (publishedDate) => {
  const now = new Date();
  const published = new Date(publishedDate);

  if (published > now) return "In the future";

  const diffInSeconds = Math.floor((now - published) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

const Articles = ({ apiKey, categState, language, dosearch, setDosearch, search }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError('');

      // Determine the URL based on the current state
      let fetchUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`;
      if (dosearch && search) {
        fetchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&language=${language}&apiKey=${apiKey}`;
      }

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setLoading(false);
        setDosearch(false); // Reset search state
      }
    };

    fetchNews();
  }, [apiKey, categState, language, dosearch, search, setDosearch]);

  return (
    <main>
      {loading ? (
        <ClipLoader className="spinner" color={"#fff"} loading={true} size={40} />
      ) : error ? (
        <div className="error">{error}</div>
      ) : articles.length > 0 ? (
        articles.map((article, index) => (
          <Article
            key={index}
            source={article.source.name}
            publishedAt={timeAgo(article.publishedAt)}
            urlToImage={article.urlToImage}
            title={article.title}
            description={article.description}
            url={article.url}
            author={article.author}
          />
        ))
      ) : (
        <div className="no_articles_container">
          <h1 className="no_articles">{dosearch ? search : categState} - language : {language}</h1>
          <h1 className="no_articles">No articles available.</h1>
        </div>
      )}
    </main>
  );
};

export default Articles;
