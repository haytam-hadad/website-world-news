
import MainTitle from "./components/MainTitle";

export const metadata = {
  title: "Home",
  description: "Welcome to my News app built with Next.js",
};

const Home = () => {

  return (
    <div>
      <MainTitle title={"Home"}/>
    </div>
  );
};

export default Home
