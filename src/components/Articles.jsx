import { useState, useEffect } from 'react';
import Article from './Article.jsx';
import ClipLoader from "react-spinners/MoonLoader.js";
import MainTitle from './MainTitle.jsx';

const apiurl = import.meta.env.VITE_API_URL;



const Articles = ({ categState, language, dosearch, setDosearch, search }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setisSearching] = useState(false);

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
    setisSearching(false)
    fetchNews(`${apiurl}/api/news/top-headlines?country=us&category=${categState}&language=${language}`);
  }, [categState]);

  useEffect(() => {
    if (dosearch && search) {
      setisSearching(true)
      fetchNews(`${apiurl}/api/news/search?q=${search}&language=${language}`);
      setDosearch(false);
    }
  }, [dosearch]);


  return (
    <>
      { categState.toLowerCase() === "general" && !isSearching ? <MainTitle title={"Breaking News"} /> : !isSearching ? <MainTitle title={`Top ${categState} Headlines`} /> : null}
      <main>
        {loading ? (
          <ClipLoader className="spinner" color={"#000"} loading={true} size={45} />
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <Article
              key={index}
              source={article.source.name}
              publishedAt= {article.publishedAt}
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
