import Article from "./components/Article.js";

export default function Home() {
  return (
    <>
      {/* <div className="text-3xl mb-5 dark:bg-[#333] text-center bg-[#eee] p-7 rounded-lg">
      <p className="font-bold text-lg">
        Welcome to World news, a platform where you can find and share the latest news from around the world.
      </p>
      <h1 className="text-lg text-mainColor">
        Stay up to date with current events and trending topics, and share your own stories with the world.
      </h1>
    </div> */}
      <h1 className="text-2xl w-fit font-bold tracking-wide px-5 py-2 rounded-lg my-2 transition-all hover:px-10">
        Latest news -&gt;
      </h1>
      <div className="flex flex-wrap gap-x-4 gap-y-10">
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit "
        />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
        <Article
          title="title 2"
          desc="lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit
           lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit "
        />
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />{" "}
        <Article
          title="title 1"
          desc="lorem ipsum dolor sit amet consectetur"
        />
      </div>
    </>
  );
}
