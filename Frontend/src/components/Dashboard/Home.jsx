import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [video, setVideos] = useState([]);

  useEffect(() => {
    getVideo();
  }, []);

  const getVideo = () => {
    axios
      .get("http://localhost:8000/api/v1/videos/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setVideos(res.data.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (video.length > 0) {
      console.log("Updated video state:", video);
    }
  }, [video]);

  return (
      <div className="grid grid-cols-3 gap-x-2 h-fit items-start p-5 ">
        {video.map((video) => (
          <div key={video._id} className="  p-2 text-white cursor-pointer rounded-2xl hover:bg-[#abaaaa27] duration-600">
            <img
              className="h-54 w-full object-cover rounded-xl"
              src={video.thumbnail}
              alt="thumbnail"
            />
            <div className="flex  p-2 items-center">
              <img className="h-10 w-10 mr-3 rounded-4xl" src={video.owner.avatar} alt="avatar" />
              <div className="w-[90%] font-medium ">
                <h2 className="text-xl">{video.title}</h2>
                <h2 className="text-[#6e6e6e] hover:text-white duration-300 w-fit ">{video.owner.fullName}</h2>
                <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                  <h2>{video.views} views</h2>
                  {/* <p>{video.createdAt}</p> */}
                  <p className="">&#x2022;</p>
                  <p>7 months</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default Home;
