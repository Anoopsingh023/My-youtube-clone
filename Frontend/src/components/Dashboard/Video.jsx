import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRandomVideos } from "../context/VideoContext";
import { motion } from "motion/react";

const Video = () => {
  const navigate = useNavigate();
  const { filteredVideos } = useRandomVideos();

  const handleClick = (videoId) => {
    navigate(`/dashboard/video/${videoId}`, );
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  return (
    <>
      {filteredVideos.map((video) => (
        <motion.div
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.95 }}
          key={video._id}
          className="  p-2 text-white cursor-pointer rounded-2xl  duration-600"
        >
          <img
            onClick={() => handleClick(video._id)}
            className="h-54 w-full object-cover rounded-xl"
            src={video.thumbnail}
            alt="thumbnail"
          />
          <div className="flex  p-2 items-center">
            <img
              onClick={() => handleProfileClick(video.owner)}
              className="h-10 w-10 mr-3 rounded-4xl"
              src={video.owner.avatar}
              alt="avatar"
            />
            <div className="w-[90%] font-medium ">
              <h2 onClick={() => handleClick(video._id)} className="text-xl">
                {video.title}
              </h2>
              <h2
                onClick={() => handleProfileClick(video.owner)}
                className="text-[#6e6e6e] hover:text-white duration-300 w-fit "
              >
                {video.owner.fullName}
              </h2>
              <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                <h2 onClick={() => handleClick(video._id)}>{video.views} views</h2>
                <p onClick={() => handleClick(video._id)}>&#x2022;</p>
                <div onClick={() => handleClick(video._id)}>
                  {video.createdAt ? (
                    <p>
                      {formatDistanceToNow(new Date(video.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  ) : (
                    <p>Unknown time</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default Video;
