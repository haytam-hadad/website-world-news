import { Link2, FileText, Video, ImageIcon, ExternalLink } from "lucide-react"

const SourcesDisplay = ({ sources }) => {
  if (!sources || sources.length === 0) return null

  const getSourceIcon = (key) => {
    switch (key.toLowerCase()) {
      case "video":
        return <Video className="w-5 h-5 mr-3 flex-shrink-0" />
      case "image":
        return <ImageIcon className="w-5 h-5 mr-3 flex-shrink-0" />
      case "document":
      case "pdf":
        return <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
      case "url":
      case "link":
        return <Link2 className="w-5 h-5 mr-3 flex-shrink-0" />
      default:
        return <ExternalLink className="w-5 h-5 mr-3 flex-shrink-0" />
    }
  }

  const getSourceLabel = (source) => {
    try {
      if (source.key === "url" || source.key === "link") {
        const url = new URL(source.value)
        return url.hostname
      }

      return source.key.charAt(0).toUpperCase() + source.key.slice(1) + " Source"
    } catch (error) {
      return source.value
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 mb-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Sources</h3>
      <ul className="space-y-2 p-1">
        {sources.map((source) => (
          <li key={source._id?.$oid || source._id} className="flex items-center">
            <a
              href={source.value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-mainColor dark:text-mainColor hover:underline"
            >
              {getSourceIcon(source.key)}
              <span>{getSourceLabel(source)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SourcesDisplay

