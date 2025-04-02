import SkeletonArticle from "../../components/SkeletonArticle"

export default function Loading() {
  return (
    <div className="container mx-auto p-1">
      <SkeletonArticle />
      <SkeletonArticle />
    </div>
  )
}

