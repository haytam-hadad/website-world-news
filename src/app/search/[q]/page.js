
import Article from "../../components/Article";


export const metadata = {
  title: "Search for News",
  description: "Latest news from around the world",
};

const Search = async ({params}) => {
  const q = await params.q ;
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/${q}`
  );

  return (
    <div>
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
                <h1 className="no_articles">No articles available with <b>{q}</b></h1>
              </div>
        }
      </main>
    </div>
  );
};

export default Search;
