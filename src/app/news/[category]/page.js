
import Article from "../../components/Article";
import MainTitle from "../../components/MainTitle";



const Category = async ({params}) => {
  const {category} = await params;
  const language = "en";
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
      {articles.length > 0 ? 
        <MainTitle title={`top ${category} headlines`} />
      : null}
      <main>
        {articles.length > 0
          ? articles.map((article, index) => (
              <Article
                title={article.title}
                key={index}
                source={article.source_name}
                timeAgo={article.timeago}
                urlToImage={article.media_url}
                description={article.description}
                url={article.url}
                author={article.author}
                category={article.category}
              />
            ))
          : 
            <div className="no_articles_container">
                <h1 className="no_articles">No articles in this category &quot;<b>{category}</b>&quot; available</h1>
              </div>
        }
      </main>
    </div>
  );
};

export default Category;
