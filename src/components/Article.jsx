import { Link } from "react-router-dom";
const Article = ({
  publishedAt,
  urlToImage,
  title,
  description ,
  url,
  author,
  source,
}) => {

  if(title != "[Removed]" && urlToImage != null ) {
    return (
      <article >
        <img
          src={urlToImage ? urlToImage : "src/assets/favicon.png"}
          alt={title ? `${title} - News Image` : "News Image"}
          loading="lazy"
        />
        <p className="time">
            <small>
            Published : {publishedAt ? publishedAt : "Unknown time"} <i className="fa-regular fa-clock" />
            </small>
        </p>
        <div id="content">
          <p className="source">{source ? source : "Unknown source"} - source</p>
          <h2 className="h22">{title}</h2>
          <p className='desc'>{description ? description : "No Description"}</p>
          <p>
            <strong>
            Author: {author ? author : "Unknown"} <i className="fa-solid fa-feather" />
            </strong>
          </p>
          <hr />
          <Link className="link_art" to={url ? url : "#" } target="_blank" rel="noopener noreferrer">
            Read full article:  <i className="fa-solid fa-arrow-up-right-from-square"> </i> 
          </Link>
        </div>
      </article>
    );    
  }
};


export default Article;
