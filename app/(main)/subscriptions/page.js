import Article from "@/components/Article"
import { ChevronDown } from "lucide-react"

const fetchSubscribedArticles = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/subscribed`, {
      credentials: "include"
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`)
    }

    const { articles, message } = await res.json()
    return { articles, message }
  } catch (error) {
    console.error("Error fetching articles:", error)
    return { articles: [], message: "Something went wrong while fetching articles." }
  }
}

const Subscribed = async () => {
  const { articles, message } = await fetchSubscribedArticles()

  return (
    <div>
      {articles.length > 0 && (
        <h2 className="title">
          Top Subscribed Headlines <ChevronDown className="ml-2 inline-block" />
        </h2>
      )}

      <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2">
        {articles.length === 0 ? (
          <h1 className="text-primary p-2">{message}</h1>
        ) : (
          articles.map((article, i) => (
            <Article key={i} articleData={article} />
          ))
        )}
      </main>
    </div>
  )
}

export default Subscribed

