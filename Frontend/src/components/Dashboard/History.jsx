import moment from "moment";
import { useHistory } from "../context/VideoContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import historyImage from "../../assets/historyImage.svg";
import { HistoryIcon } from "lucide-react";

const History = () => {
  const { history, removevideo, clearHistory } = useHistory();

  const navigate = useNavigate();

  const handleClick = (videoId) => {
    navigate(`/dashboard/video/${videoId}`);
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  const handleLogClick = () => {
    navigate(`/login`);
  };

  const [isloged, setisLoged] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setisLoged(true);
    }
  }, []);

  return (
    <>
      {isloged ? (
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold">Watch History</h2>
            {history.length > 0 && (
              <button
                className="text-[#504e4e] hover:text-white text-sm sm:text-base"
                onClick={clearHistory}
              >
                Clear All
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
                  className="flex flex-col sm:flex-row gap-4 items-start bg-transparent group hover:bg-[#4c4b4b16] transition-all duration-300 p-2 rounded-lg"
                >
                  <img
                    onClick={() => handleClick(video._id)}
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="w-full sm:w-56 h-36 object-cover rounded-md cursor-pointer"
                  />

                  <div className="flex-1">
                    <h3
                      onClick={() => handleClick(video._id)}
                      className="text-md sm:text-lg font-medium line-clamp-2 cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    <p
                      onClick={() => handleProfileClick(video.owner)}
                      className="text-sm sm:text-md text-gray-400 cursor-pointer hover:text-white"
                    >
                      {video.owner.fullName}
                    </p>
                    <p className="text-sm text-gray-400">{video.views} views</p>
                    <p className="text-xs text-gray-500">
                      Watched {moment(watchedAt).fromNow()}
                    </p>
                  </div>

                  <button
                    className="self-start sm:self-center hover:bg-[#636262] p-2 rounded-full"
                    onClick={() => removevideo(video._id)}
                  >
                    <i className="fa-solid fa-xmark text-sm sm:text-base"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center gap-4">
          {/* <img className="w-30 h-30" src={historyImage} alt="history" /> */}
          <HistoryIcon size={100}/>
          <h2 className="text-4xl">Keep track of what you watch</h2>
          <p className="">
            Watch history isn't viewable when you're signed out
          </p>
          <button
            onClick={handleLogClick}
            className="border bg-[#232323] py-2 px-4 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
          >
            <i class="fa-regular fa-user"></i> Sign in
          </button>
        </div>
      )}
    </>
  );
};

export default History;
