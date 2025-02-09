import SkeletonArticle from "./components/SkeletonArticle";

export default function Loading() {
  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Loading articles...</h2>
      <SkeletonArticle num={6} />
    </section>
  );
}
