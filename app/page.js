import Article from "./components/Article.js";
import SkeletonArticle from "./components/SkeletonArticle.js";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl w-fit font-bold tracking-wide px-5 py-2 rounded-lg my-2 transition-all hover:px-10">
        Latest news -&gt;
      </h1>

      <div className="flex flex-wrap gap-x-4 gap-y-10">
        <SkeletonArticle num={5} />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="lorem ipsum dolor sit amet"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="lorem ipsum dolor sit amet lorem ipsum dolor sit amet"
          desc="lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit "
        />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="lorem ipsum dolor sit amet"
          desc="lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit "
        />
        <Article
          title="lorem ipsum dolor sit amet lorem"
          desc="lorem ipsum dolor sit amet consectetur"
        />{" "}
        <Article
          title="title 0 lorem ipsum dolor sit amet"
          desc="lorem ipsum dolor sit amet consectetur"
        />
                <Article
          title="lorem ipsum dolor sit amet lorem ipsum dolor sit amet"
          desc="lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit "
        />
      </div>
    </>
  );
}
