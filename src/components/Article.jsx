
const Article = ({
  publishedAt,
  urlToImage,
  title = "No Title",
  description = "No Description",
  url = "#",
  author = "Unknown",
}) => {
  console.log({ publishedAt, urlToImage, title, description, url, author });

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
          Published: {publishedAt} <i className="fa-regular fa-clock" />
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
