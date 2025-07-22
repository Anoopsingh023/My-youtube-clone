import Video from "./Video";

const Home = () => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 items-start">
      {<Video />}
    </div>
  );
};

export default Home;
