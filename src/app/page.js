
"use client";
import { useState, useEffect } from 'react';
import Article from './components/Article';
import MainTitle from './components/MainTitle.jsx';
// import ClipLoader from "react-spinners/MoonLoader.js";



const Home = ({ categState, language, dosearch, setDosearch, search }) => {
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
    setisSearching(false);
    const fetchTopHeadlines = async () => {
      await fetchNews(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles/top-news/${categState}/${language}`);
    };
    fetchTopHeadlines();
    console.log("category:", categState);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [categState, language]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (dosearch && search) {
        setisSearching(true);
        console.log("Searching for:", search);
        await fetchNews(`${process.env.NEXT_PUBLIC_API_URL}/api/news-articles/search/${encodeURIComponent(search)}/${language}`);
        setDosearch(false);
      }
    };
    console.log("search:", search);
  });

  return (
    <>
      {categState === "general" && !isSearching ? <MainTitle title={"breaking news"} /> : !isSearching ? <MainTitle title={`top ${categState} headlines`} /> : null}
      <main>
        {loading ? (
          // <ClipLoader className="spinner" color={"#000"} loading={true} size={40}/>
          "Loading..."
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
            <h1 className="no_articles"> <b>`{search}`</b> - - language: <b>`{language}`</b></h1>
            <h1 className="no_articles">No articles available.</h1>
          </div>
        )}
      </main>
    </>
  );
};

export default Home
