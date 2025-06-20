import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useParams, useNavigate,  } from "react-router-dom";

const ChannelProfile = () => {
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    getChannelProfile();
  }, [username]);

  const getVideo = (userId) => {
    axios
      .get(`http://localhost:8000/api/v1/videos/u/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Channel's videos", res.data);
        const videoData = res.data?.data?.[0]; // null-safe access
        const video = videoData?.video || []; // fallback to empty array
        setVideos(video);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getChannelProfile = () => {
    axios
      .get(`http://localhost:8000/api/v1/users/c/${username}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Channel Profile", res.data);
        const userData = res.data.data;
        setUser(res.data.data);
        getVideo(userData._id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSubscription = (userId) => {
    axios
      .post(
        `http://localhost:8000/api/v1/subscriptions/c/${userId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("Toggle subscription", res.data);
        getChannelProfile();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubscription = (userId) => {
    toggleSubscription(userId);
  };

  const handleVideoClick = (video) => {
    navigate("/dashboard/video-page", {state: {video}})
  }


  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col">
        <img
          className="h-35 m-5 mb-0 text-white object-cover"
          src={(user.coverImage) || null }
          alt="cover image"
        />
        <div className="flex flex-row m-5 p-3 items-center">
          <img
            className="h-35 w-35 mr-5 rounded-[50%]"
            src={user.avatar}
            alt="avatar"
          />
          <div className="flex flex-col gap-2 text-white ">
            <h2 className="text-5xl">{user.fullName}</h2>
            <p>{user.username}</p>
            <div onClick={() => handleSubscription(user._id)}>
              {user.isSubscribed ? (
                <>
                  <h4 className="border rounded-4xl px-4 py-2 w-fit cursor-pointer bg-[#343434]">
                    <i class="fa-solid fa-bell mr-2"></i> Subscribed
                  </h4>
                </>
              ) : (
                <>
                  <h4 className="rounded-4xl px-4 py-2 w-fit cursor-pointer bg-[#eaeaea] text-[#000000] ">
                    Subscribe
                  </h4>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 mx-5 text-white">
          <Link className="border-b-2 border-black hover:border-b-[#5a5959] duration-500 px-2 pb-2 mb-1">
            Home
          </Link>
          <Link className="border-b-2 border-black hover:border-b-[#5a5959] duration-300 px-2 pb-2 mb-1">
            Videos
          </Link>
          <Link className="border-b-2 border-black hover:border-b-[#5a5959] duration-300 px-2 pb-2 mb-1">
            Playlist
          </Link>
          <Link className="border-b-2 border-black hover:border-b-[#5a5959] duration-300 px-2 pb-2 mb-1">
            Tweets
          </Link>
        </div>
      </div>

      <hr className="text-white" />

      <div className="grid grid-cols-3 gap-x-2 h-fit items-start p-5 pb-40">
        {videos.map((video) => (
          <div
            onClick={()=>handleVideoClick(video)}
            key={video._id}
            className="  p-2 text-white cursor-pointer rounded-2xl hover:bg-[#abaaaa27] duration-600"
          >
            <img
              className="h-54 w-full object-cover rounded-xl"
              src={video.thumbnail}
              alt="thumbnail"
            />
            <div className="flex flex-col  p-2 font-medium">
              {/* <div className="w-[90%] font-medium "> */}
              <h2 className="text-xl">{video.title}</h2>
              <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                <h2>{video.views} views</h2>
                <p className="">&#x2022;</p>
                <p>7 months</p>
              </div>
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ChannelProfile;
