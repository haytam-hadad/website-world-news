import Article from './Article.jsx';
import { useState, useEffect } from 'react';

const apiKey = "7050f6e3f12b4a4794b0ab06803e88e5";
let currentLanguage = "en";

const Articles = () => {
  const [articles, setArticles] = useState([]);

  const fetchNews = (fetchUrl) => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data.articles);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  };

  useEffect(() => {
    const url = `https://newsapi.org/v2/top-headlines?language=${currentLanguage}&apiKey=${apiKey}`;
    fetchNews(url);
  }, []);

  return (
    <main>
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <Article
          key={index}
          publishedAt={article.publishedAt}
          urlToImage={article.urlToImage}
          title={article.title}
          description={article.description}
          url={article.url}
          author={article.author}/>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </main>
  );
};

export default Articles;