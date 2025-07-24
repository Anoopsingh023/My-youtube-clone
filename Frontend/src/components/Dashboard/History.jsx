import moment from "moment";
import { useHistory } from "../context/VideoContext";
import { useNavigate } from "react-router-dom";

const History = () => {
  const { history, removevideo, clearHistory } = useHistory();

  const navigate = useNavigate();

  const handleClick = (video) => {
    navigate("/dashboard/video-page", { state: { video } });
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Watch History</h2>
        {history.length > 0 && (
          <button
            className="cursor-pointer text-[#504e4e] hover:text-white"
            onClick={clearHistory}
          >
            clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center">No watch history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map(({ video, watchedAt }) => (
            <div
              key={video._id}
              className="flex gap-4 items-start  pb-4 group hover:bg-[#4c4b4b16] duration-500 p-2 rounded-lg"
            >
              <img
                onClick={() => handleClick(video)}
                src={video.thumbnail}
                alt="thumbnail"
                className="w-54 h-38 object-cover rounded-md cursor-pointer"
              />
              <div className="flex-1">
                <h3
                  onClick={() => handleClick(video)}
                  className="text-lg font-medium line-clamp-2 cursor-pointer"
                >
                  {video.title}
                </h3>
                <p
                  onClick={() => handleProfileClick(video.owner)}
                  className="text-md text-gray-400 cursor-pointer hover:text-white"
                >
                  {video.owner.fullName}
                </p>
                <p className="text-sm text-gray-400">{video.views} views</p>
                <p className="text-sm text-gray-500">
                  Watched {moment(watchedAt).fromNow()}
                </p>
              </div>
              <button
                className="cursor-pointer hover:bg-[#636262] py-2 px-4 rounded-full"
                onClick={() => removevideo(video._id)}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
