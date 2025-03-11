import Article from "@/components/Article"
import { ChevronDown, AlertCircle } from "lucide-react"
import Welcome from "@/components/Welcome"
import { Suspense } from "react"
import SkeletonArticle from "@/components/SkeletonArticle"

const fetchArticles = async () => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/latest`

    if (!apiUrl) throw new Error("API URL is not defined in environment variables")

    const res = await fetch(apiUrl, {
      cache: "no-store",
      // Add timeout for better UX on slow connections
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`)
    }

    const articles = await res.json()
    return Array.isArray(articles) ? articles : []
  } catch (error) {
    console.error("Error fetching articles:", error)
    throw error // Re-throw to be caught by the error boundary
  }
}

export default async function Home() {
  let articles = []
  let error = null

  try {
    articles = await fetchArticles()
  } catch (err) {
    error = err.message || "Failed to load articles"
  }

  return (
    <div>
      {/* Articles Section */}
      <h2 className="title">
        Latest News <ChevronDown className="ml-2 inline-block" />
      </h2>

      <Suspense
        fallback={
          <>
            <SkeletonArticle />
            <SkeletonArticle />
            <SkeletonArticle />
          </>
        }
      >
        <main className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-2">
          {error ? (
            <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-400">{error}. Please try refreshing the page.</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="w-full text-center p-6">
              <h1 className="text-primary p-2">No articles available at the moment</h1>
              <p className="text-gray-500 dark:text-gray-400">Check back later for fresh content</p>
            </div>
          ) : (
            articles.map((article, i) => <Article key={article._id || i} articleData={article} />)
          )}
        </main>
      </Suspense>
    </div>
  )
}

