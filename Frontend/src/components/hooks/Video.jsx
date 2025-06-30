import axios from "axios";
import React, { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    getVideo();
  }, []);

  const getVideo = () => {
    axios
      .get("http://localhost:8000/api/v1/videos/", {
        headers: {
          
        },
      })
      .then((res) => {
        console.log("seperate user's video", res.data);
        setVideos(res.data.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (video) => {
    navigate("/dashboard/video-page", { state: { video } });
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };


  return (
    <>
      {videos.map((video) => (
        <div
          key={video._id}
          className="  p-2 text-white cursor-pointer rounded-2xl hover:bg-[#abaaaa27] duration-600"
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
              <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                <h2 onClick={() => handleClick(video)}>{video.views} views</h2>
                {/* <p>{video.createdAt}</p> */}
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Video;
