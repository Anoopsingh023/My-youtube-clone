import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Comment from "../comment/Comment";
import Video from "./Video";
import { toast } from "react-toastify";
import { base_url } from "../../utils/constant";
import { useHistory } from "../context/VideoContext";
import { motion } from "motion/react";

const VideoPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [likes, setLikes] = useState("");
  const [isLikedByUser, setIsLikedByUser] = useState("");
  const [isDisliked, setIsDislike] = useState(false);
  const [views, setViews] = useState("");

  const { addToWatchHistory } = useHistory();

  const video = state?.video;
  console.log("video-page", video);

  useEffect(() => {
    getChannelProfile();
    getTotalLikes();
    isVideoLiked();
    getvideoViews();
  }, [video.owner.username, video._id]);

  const getvideoViews = () => {
    axios
      .put(`${base_url}/api/v1/videos/views/${video._id}`,{}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Video views", res.data);
        setViews(res.data.data.views);
      })
      .catch((err) => {
        console.log("Video views error", err);
      });
  };

  const getChannelProfile = () => {
    axios
      .get(`${base_url}/api/v1/users/c/${video.owner.username}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Channel Profile", res.data);
        const userData = res.data.data;
        setUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSubscription = (userId) => {
    axios
      .post(
        `${base_url}/api/v1/subscriptions/c/${userId}`,
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
        toast.error("Login required");
      });
  };

  const handleSubscription = (userId) => {
    toggleSubscription(userId);
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  const getTotalLikes = () => {
    axios
      .get(`${base_url}/api/v1/likes/${video._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Get total Likes ", res.data);
        setLikes(res.data.data[0].likesCount);
      })
      .catch((err) => {
        console.log("get Total Likes Error", err);
      });
  };

  const toggleLikes = (videoId) => {
    axios
      .post(
        `${base_url}/api/v1/likes/toggle/v/${videoId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("toggleLikes", res.data);
        getTotalLikes();
        isVideoLiked();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Login required");
      });
  };

  const isVideoLiked = () => {
    axios
      .get(`${base_url}/api/v1/likes/toggle/v/${video._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("isLiked", res.data);
        setIsLikedByUser(res.data.data.isLiked);
      })
      .catch((err) => {
        console.log("isLikedError", err);
        // toast.error("Login not required");
      });
  };

  const handleLikes = (videoId) => {
    toggleLikes(videoId);
  };

  const handleDiskie = () => {
    setIsDislike(!isDisliked);
  };

  console.log("videoId", video._id);

  if (!video) return <p>Video not found</p>;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: "spring", visualDuration: 0.6, bounce: 0.1 },
      }}
      className="flex flex-col lg:flex-row text-white m-3 lg:m-5 gap-4 lg:gap-5 pb-40"
    >
      <div className="w-full lg:w-[65%]">
        <video src={video.videoFile} controls className="rounded-2xl w-full" />
        <h1 className="text-white text-lg md:text-xl font-medium mt-2">
          {video.title}
        </h1>

        {/* Channel Info for mobile */}
        <div className="sm:hidden mt-3 flex items-center gap-3">
          <img
            onClick={() => handleProfileClick(video.owner)}
            className="h-10 w-10 rounded-full cursor-pointer"
            src={video.owner.avatar}
            alt="channel avatar"
          />
          <div>
            <h2
              onClick={() => handleProfileClick(video.owner)}
              className="cursor-pointer text-base"
            >
              {video.owner.fullName}
            </h2>
            <h4 className="text-[#a9a9a9] text-sm">
              {user.subscriberCount} subscribers
            </h4>
          </div>
          <div onClick={() => handleSubscription(user._id)}>
            {user.isSubscribed ? (
              <h4 className="rounded-full px-4 py-1 cursor-pointer bg-[#343434] text-sm">
                <i className="fa-solid fa-bell mr-2"></i> Subscribed
              </h4>
            ) : (
              <h4 className="rounded-full px-4 py-1 cursor-pointer bg-[#eaeaea] text-black text-sm">
                Subscribe
              </h4>
            )}
          </div>
        </div>

        {/* Buttons for mobile view */}
        <div className="flex flex-wrap gap-2 mt-3 sm:hidden mb-5">
          <div className="flex-1 flex justify-around">
            <p
              onClick={() => handleLikes(video._id)}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              {isLikedByUser ? (
                <i className="fa-solid fa-thumbs-up"></i>
              ) : (
                <i className="fa-regular fa-thumbs-up"></i>
              )}{" "}
              {likes}
            </p>
            <p onClick={handleDiskie} className="text-sm cursor-pointer">
              {isDisliked ? (
                <i className="fa-solid fa-thumbs-down"></i>
              ) : (
                <i className="fa-regular fa-thumbs-down"></i>
              )}
            </p>
            <p className="text-sm cursor-pointer">
              <i className="fa-solid fa-share"></i>
            </p>
            <p className="text-sm cursor-pointer">
              <i className="fa-solid fa-download"></i>
            </p>
          </div>
        </div>

        {/* Desktop layout remains unchanged */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 my-4 hidden sm:flex">
          <div className="flex items-center gap-3">
            <img
              onClick={() => handleProfileClick(video.owner)}
              className="h-10 w-10 rounded-full cursor-pointer"
              src={video.owner.avatar}
              alt="channel avatar"
            />
            <div>
              <h2
                onClick={() => handleProfileClick(video.owner)}
                className="cursor-pointer text-base"
              >
                {video.owner.fullName}
              </h2>
              <h4 className="text-[#a9a9a9] text-sm">
                {user.subscriberCount} subscribers
              </h4>
            </div>
            <div onClick={() => handleSubscription(user._id)}>
              {user.isSubscribed ? (
                <h4 className="rounded-full px-4 py-1 cursor-pointer bg-[#343434] text-sm">
                  <i className="fa-solid fa-bell mr-2"></i> Subscribed
                </h4>
              ) : (
                <h4 className="rounded-full px-4 py-1 cursor-pointer bg-[#eaeaea] text-black text-sm">
                  Subscribe
                </h4>
              )}
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 flex-wrap">
            <div className="flex gap-3 items-center rounded-full px-4 py-1 bg-[#343434] cursor-pointer text-sm">
              <p
                onClick={() => handleLikes(video._id)}
                className="border-r border-[#767776] pr-3"
              >
                {isLikedByUser ? (
                  <i className="fa-solid fa-thumbs-up"></i>
                ) : (
                  <i className="fa-regular fa-thumbs-up"></i>
                )}{" "}
                {likes}
              </p>
              <p onClick={handleDiskie}>
                {isDisliked ? (
                  <i className="fa-solid fa-thumbs-down"></i>
                ) : (
                  <i className="fa-regular fa-thumbs-down"></i>
                )}
              </p>
            </div>
            <p className="rounded-full px-4 py-1 bg-[#343434] cursor-pointer text-sm">
              <i className="fa-solid fa-share pr-2"></i>Share
            </p>
            <p className="rounded-full px-4 py-1 bg-[#343434] cursor-pointer text-sm">
              <i className="fa-solid fa-download pr-2"></i>Download
            </p>
          </div>
        </div>

        <div className="bg-[#3f3f3f] p-3 rounded-xl mb-6 text-sm ">
          <div className="flex gap-4 mb-2">
            <p>{views} views</p>
            <p>{moment(video.createdAt).fromNow()}</p>
          </div>
          <p>{video.description}</p>
        </div>

        <div>
          <Comment message={video} />
        </div>
      </div>

      <div className="w-full lg:w-[30%]">
        <Video />
      </div>
    </motion.div>
  );
};

export default VideoPage;
