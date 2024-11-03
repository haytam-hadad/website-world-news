import { useState, useEffect } from 'react';
import Article from './Article.jsx';
import ClipLoader from "react-spinners/MoonLoader.js";
import MainTitle from './MainTitle.jsx';

const apiurl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiurl);


const Articles = ({ categState, language, dosearch, setDosearch, search }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data.articles || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!dosearch) {
      fetchNews(`${apiurl}/api/news/top-headlines?country=us&category=${categState}&language=${language}`);
    }
  }, [categState, language]);

  useEffect(() => {
    if (dosearch && search) {
      fetchNews(`${apiurl}/api/news/search?q=${search}&language=${language}`);
      setDosearch(false);
    }
  }, [dosearch, search, language]);

  return (
    <>
      <MainTitle title={"Today's Top News Headlines"} />
      <main>
        {loading ? (
          <ClipLoader className="spinner" color={"#fff"} loading={true} size={40} />
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <Article
              key={index}
              source={article.source.name}
              publishedAt={new Intl.DateTimeFormat(undefined, {
                year: "2-digit",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }).format(new Date(article.publishedAt))}
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
    </>
  );
};

export default Articles;
