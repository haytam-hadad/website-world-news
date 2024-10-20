import Article from './Article.jsx';
import { useState, useEffect } from 'react';
import { FaSpinner } from "react-icons/fa";

//7050f6e3f12b4a4794b0ab06803e88e5
const apiKey = "7050f6e3f12b4a4794b0ab06803e88e5" ;
console.log(apiKey);
const currentLanguage = "en";

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

  
  console.log(articles)
  return (
    <main>
      {articles.length > 0 ? (
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
        <FaSpinner className='spinner' />
      )}
    </main>
  );
};

export default Articles;
