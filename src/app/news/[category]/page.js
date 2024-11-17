
// "use client";
import Article from "../../components/Article";
import MainTitle from "../../components/MainTitle";

const News = ({ params }) => {
  let articles = [];
  const { category, language } = params;

  const fetchNews = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      articles = data.articles || [];
      console.log(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
    }
  };

  fetchNews(
    `${process.env.NEXT_PUBLIC_API_URL}/api/news-articles/top-news/${category}/${language}`
  );

  return (
    <div>
      {category === "general" ? (
        <MainTitle title={"breaking news"} />
      ) : (
        <MainTitle title={`top ${category} headlines`} />
      )}
      <main>
        {articles.length > 0
          ? articles.map((article, index) => (
              <Article
                key={index}
                source={article.source.name}
                publishedAt={article.publishedAt}
                urlToImage={article.urlToImage}
                title={article.title}
                description={article.description}
                url={article.url}
                author={article.author}
              />
            ))
          : //   <div className="no_articles_container">
            //     <h1 className="no_articles"> <b>`{search}`</b> - - language: <b>`{language}`</b></h1>
            //     <h1 className="no_articles">No articles available.</h1>
            //   </div>
            " loading... "}
      </main>
    </div>
  );
};

export default News;
