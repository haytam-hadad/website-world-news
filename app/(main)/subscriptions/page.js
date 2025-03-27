import Article from "@/components/Article"
import { ChevronDown } from "lucide-react"

const fetchSubscribedArticles = async () => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/subscribed`

    if (!apiUrl) throw new Error("API URL is not defined in environment variables")

    const res = await fetch(apiUrl, {
      credentials: "include"
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`)
    }

    const articles = await res.json()
    return Array.isArray(articles.articles) ? articles.articles : []
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

const Subscribed = async () => {
  const articles = await fetchSubscribedArticles()

  return (
    <div>
      {articles.length > 0 && (
        <h2 className="title">
          Top Subscribed Headlines <ChevronDown className="ml-2 inline-block" />
        </h2>
      )}

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2">
        {articles.length === 0 ? (
          <h1 className="text-primary p-2">No articles available</h1>
        ) : (
          articles.map((article, i) => {
            return <Article key={i} articleData={article} />
          })
        )}
      </main>
    </div>
  )
}

export default Subscribed

