
const Article = ({
  publishedAt,
  urlToImage,
  title = "No Title",
  description = "No Description",
  url = "#",
  author = "Unknown",
}) => {
  console.log({ publishedAt, urlToImage, title, description, url, author });

  const timeAgo = (publishedDate) => {
    const now = new Date();
    const published = new Date(publishedDate);
    const diffInSeconds = Math.floor((now - published) / 1000);

    const seconds = diffInSeconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  const handleImageError = (e) => {
    e.target.src = "src/assets/favicon.png";
  };

  return (
    <article>
      <img
        src={urlToImage ? urlToImage : "src/assets/favicon.png"}
        alt={title ? `${title} - News Image` : "News Image"}
        onError={handleImageError}
        loading="lazy"
      />
      <p>
        <small>
          Published: {timeAgo(publishedAt)} <i className="fa-regular fa-clock" />
        </small>
      </p>
      <h2>{title}</h2>
      <p className='desc'>{description}</p>
      <p>
        <strong>
          By: {author} <i className="fa-solid fa-feather" />
        </strong>
      </p>
      <hr />
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read full article:
      </a>
    </article>
  );
};


export default Article;
