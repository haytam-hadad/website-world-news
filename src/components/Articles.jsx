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
  const [url, setUrl] = useState(`https://newsapi.org/v2/top-headlines?language=${language}&apiKey=${apiKey}`);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUrl(`https://newsapi.org/v2/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`);
  }, [categState]);

  useEffect(() => {
    if (dosearch) {
      setUrl(`https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&language=${language}&apiKey=${apiKey}`);
      setDosearch(false);
    }
  }, [dosearch, language]);

  const fetchNews = (fetchUrl) => {
    setLoading(true);
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews(url);
  }, [url]);

  return (
    <main>
      {loading ? (
        <ClipLoader className="spinner" color={"#fff"} loading={true} size={40} />
      ) : (
        articles.length > 0 ? (
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
        )
      )}
    </main>
  );
};

export default Articles;
