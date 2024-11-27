

import Article from "../components/Article";
import MainTitle from "../components/MainTitle";
import usePathname from "next/navigation";


// export const metadata = {
//   title: `${category[0].toUpperCase()}${category.substring(1)} News - Breaking News`,
//   description: `Stay informed with the latest updates on ${category}. Comprehensive coverage of top stories and news, updated regularly.`,
// };


const News = async ({ params }) => {

  const language = "en";
  const { category } = await params;
  let articles = [];


  const fetchNews = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      articles = data || [];
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  await fetchNews(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${category}`
  );

  return (
    <div>
      {category === "general" && articles.length > 0 ? (
        <MainTitle title={"breaking news"} />
      ) : ( articles.length > 0 ?
        <MainTitle title={`top ${category} headlines`} /> : null
      )}
      <main>
        {articles.length > 0
          ? articles.map((article, index) => (
              <Article
                title={article.title}
                key={index}
                source={article.source_name}
                timeAgo={article.timeago}
                urlToImage={article.url_to_image}
                description={article.description}
                url={article.url}
                author={article.author}
                category={article.category}
              />
            ))
          : 
            <div className="no_articles_container">
                <h1 className="no_articles">No articles available in <b>{category}</b></h1>
              </div>
        }
      </main>
    </div>
  );
};

export default News;
