
import Link  from 'next/link';
import Image from 'next/image';

const Article = ({
  timeAgo,
  urlToImage,
  title,
  description ,
  url,
  author,
  source,
}) => {

  // const timeAgo = (dateString) => {
  //   const publishedDate = new Date(dateString);
  //   const now = new Date();
  //   const diffInMs = now - publishedDate;
  //   const diffInSeconds = Math.floor(diffInMs / 1000);
  //   const diffInMinutes = Math.floor(diffInSeconds / 60);
  //   const diffInHours = Math.floor(diffInMinutes / 60);
  //   const diffInDays = Math.floor(diffInHours / 24);

  //   if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  //   if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  //   if (diffInHours < 24) return `${diffInHours} hours ago`;
  //   return `${diffInDays} days ago`;
  // };


  if(title != "[Removed]" && urlToImage != null ) {
    return (
      <article >
        <Image
          src={urlToImage ? urlToImage : "src/assets/favicon.png"}
          alt={title ? `${title} - News Image` : "News Image"}
          loading="lazy"
          width={400}
          height={200}
        />
        <p className="time">
            <small>
            Published : {timeAgo ? timeAgo : "Unknown time"} h <i className="fa-regular fa-clock" />
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
          <Link className="link_art" href={url ? url : "#" } target="_blank" rel="noopener noreferrer">
            Read full article:  <i className="fa-solid fa-arrow-up-right-from-square"> </i> 
          </Link>
        </div>
      </article>
    );    
  }else{
    return null 
  }
};


export default Article;
