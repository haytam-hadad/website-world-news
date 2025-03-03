import OnePost from "@/app/components/OnePost";
const fetchArticle = async (id) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch article: ${res.status} ${res.statusText}`);
    }
    const article = await res.json();
    return article || null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export default async function SinglePost({ params }) {
  const { id } = await params;
  const post = await fetchArticle(id);

  if (!post) {
    return <p className="text-center text-red-500 text-xl font-bold">Error: Article not found</p>;
  }

  return (
      <OnePost post={post} />
  );
}