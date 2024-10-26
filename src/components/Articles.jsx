import Article from './Article.jsx';
import { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/MoonLoader.js";

const Articles = ({ apiUrl, apiKey, categState, language, dosearch, setDosearch, search }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(`${apiUrl}/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`);

  useEffect(() => {

    setUrl(`${apiUrl}/top-headlines?country=us&category=${categState}&language=${language}&apiKey=${apiKey}`);
  }, [categState, language, apiKey, apiUrl]);

  useEffect(() => {

    if (dosearch && search) {
      setUrl(`${apiUrl}/everything?q=${encodeURIComponent(search)}&language=${language}&apiKey=${apiKey}`);
      setDosearch(false);
    }
  }, [dosearch, search, language, apiKey, apiUrl]);

  const fetchNews = async (fetchUrl) => {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
            publishedAt={new Intl.DateTimeFormat(undefined, { year: "2-digit", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(article.publishedAt))}
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
