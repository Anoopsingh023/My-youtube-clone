import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { base_url } from "../../utils/constant";

const WatchLater = () => {
  const [watchLaterVideos, setWatchlaterVideos] = useState([]);
  const navigate = useNavigate();

  const fetchWatchLaterVideos = async () => {
    try {
      // setLoading(true);
      const res = await axios.get(`${base_url}/api/v1/videos/watch-later`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const userData = res.data.data || [];
      // console.log("watch later videos", res.data);
      setWatchlaterVideos(userData || []);
    } catch (err) {
      // console.error("User video error", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchLaterVideos();
  }, []);

  const handleClick = (video) => {
    navigate(`/dashboard/video/${video._id}`);
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl">Watch Later</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 items-start">
        {watchLaterVideos.map((video) => (
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.95 }}
            key={video._id}
            className="  p-2 text-white cursor-pointer rounded-2xl  duration-600"
          >
            <img
              onClick={() => handleClick(video)}
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
                <h2 onClick={() => handleClick(video)} className="text-xl">
                  {video.title}
                </h2>
                <h2
                  onClick={() => handleProfileClick(video.owner)}
                  className="text-[#6e6e6e] hover:text-white duration-300 w-fit "
                >
                  {video.owner.fullName}
                </h2>
                {/* <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                <h2 onClick={() => handleClick(video)}>{video.views} views</h2>
                <p onClick={() => handleClick(video)}>&#x2022;</p>
                <div onClick={() => handleClick(video)}>
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
              </div> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
