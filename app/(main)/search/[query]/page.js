import Search from "@/components/Search"

export default async function SearchPage({ params }) {
  const query = decodeURIComponent((await params).query)
  return <Search query={query} />
}

