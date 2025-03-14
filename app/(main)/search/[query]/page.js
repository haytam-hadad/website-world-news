import Article from "@/components/Article"
import { ChevronDown } from 'lucide-react'

async function fetchSearchResults(query) {
  try {
    if (!query) return []

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/search/${encodeURIComponent(query)}`
    console.log("Fetching search results from:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store"
    })

    if (!res.ok) {
      console.log(`Error response: ${res.status}`);
      return []; 
    }

    const data = await res.json();
    console.log(`Received ${Array.isArray(data) ? data.length : 0} search results`);
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching search results:", error)
    return []
  }
}

export default async function Search({ params }) {
  const query = decodeURIComponent(params.query);
  console.log("Search page rendering with query:", query);
  
  const articles = await fetchSearchResults(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        {articles.length > 0 ? (
          <>
            Search Results for <span className="underline">{query}</span>
            <ChevronDown className="ml-2 inline-block" />
          </>
        ) : (
          <>No results found for <span className="underline">{query}</span></>
        )}
      </h2>
      
      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-4">
        {articles.length === 0 ? (
          <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
            No articles found matching your search. Try different keywords.
          </div>
        ) : (
          articles.map((article) => {
            // Format the data to match what Article component expects
            const formattedArticle = {
              _id: article._id,
              title: article.title || "No title available",
              content: article.content || "No content available",
              imageUrl: article.imageUrl || "/placeholder.svg",
              author: article.authordisplayname || article.authorusername || "Unknown",
              publishedAt: article.publishedAt,
              category: article.category || "General",
              comments: [] // Add empty comments array if your Article component expects it
            };
            
            return (
              <Article
                key={article._id || Math.random().toString(36)}
                articleData={formattedArticle}
              />
            );
          })
        )}
      </main>
    </div>
  )
}
