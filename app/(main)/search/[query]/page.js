"use client"

// Keep the existing fetch function for articles
async function fetchSearchResults(query) {
  try {
    if (!query) return []

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/search/${encodeURIComponent(query)}`
    console.log("Fetching search results from:", apiUrl)

    const res = await fetch(apiUrl)

    if (!res.ok) {
      console.log(`Error response: ${res.status}`)
      return []
    }

    const data = await res.json()
    console.log(`Received ${Array.isArray(data) ? data.length : 0} search results`)

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching search results:", error)
    return []
  }
}

// Real function to fetch profiles from the API
async function fetchProfileResults(query) {
  try {
    if (!query) return []

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/search/${encodeURIComponent(query)}`
    console.log("Fetching profile results from:", apiUrl)

    const res = await fetch(apiUrl, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.log(`Error response: ${res.status}`)
      return []
    }

    const data = await res.json()
    console.log(`Received ${data.users ? data.users.length : 0} profile results`)

    return data.users || []
  } catch (error) {
    console.error("Error fetching profile results:", error)
    return []
  }
}

import Search from "@/components/Search"

export default function SearchPage({ params }) {
  const query = decodeURIComponent(params.query)
  return <Search query={query} />
}

