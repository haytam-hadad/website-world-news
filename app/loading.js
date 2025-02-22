import SkeletonArticle from "./components/SkeletonArticle";

export default function Loading() {
  return (
    <div className="container mx-auto p-1">
      <h2 className="text-xl font-semibold mb-3 p-1 opacity-50">Loading articles...</h2>
      <SkeletonArticle/>
      <SkeletonArticle/>
    </div>
  );
}
