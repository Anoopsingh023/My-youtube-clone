import React, { useEffect, useState } from "react";
import useVideo from "../hooks/useVideo";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import Video from "./Video";
import Comment from "../comment/Comment";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useLike from "../hooks/useLike";
import useSave from "../hooks/useSave";
import useChannel from "../hooks/useChannel";
import useSubscription from "../hooks/useSubscription";
import axios from "axios";
import { base_url } from "../../utils/constant";
import { toast } from "react-toastify";
import useHistory from "../hooks/useHistory";

const WatchPage = () => {
  const { videoId } = useParams();

  const navigate = useNavigate();

  const { videoById } = useVideo(videoId);
  const { likes, isLikedByUser, toggleLikes } = useLike(videoId);
  const { isSaved, saveVideo } = useSave(videoId);
  const username = videoById?.owner?.username;
  const userId = videoById?.owner?._id;
  const { user, getChannelProfile } = useChannel(username);
  const { toggleSubscription } = useSubscription(userId);
  const {addToWatchHistory} = useHistory(videoId)

  const [isDisliked, setIsDislike] = useState(false);
  const [views, setViews] = useState("");

  useEffect(()=>{
    getvideoViews()
    addToWatchHistory(videoId)
  },[videoId])

  const getvideoViews = () => {
    axios
      .put(
        `${base_url}/api/v1/videos/views/${videoId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Video views", res.data);
        setViews(res.data.data.views);
      })
      .catch((err) => {
        // console.log("Video views error", err);
      });
  };

  const handleDiskie = () => {
    setIsDislike(!isDisliked);
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  const handleSubscription = async () => {
  try {
    const toggleResult = await toggleSubscription(userId);
    const profileResult = await getChannelProfile(username);
  } catch (err) {
    // console.error("❌ Error in handleSubscription", err);
    toast.error("Please Ligin")
  }

};


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
        <video
          src={videoById.videoFile}
          controls
          className="rounded-2xl w-full"
        />
        <h1 className="text-white text-lg md:text-xl font-medium mt-2">
          {videoById.title}
        </h1>

        {/* Channel Info for mobile */}
        <div className="sm:hidden mt-3 flex items-center gap-3">
          <img
            onClick={() => handleProfileClick(videoById.owner)}
            className="h-10 w-10 rounded-full cursor-pointer"
            src={videoById.owner?.avatar}
            alt="channel avatar"
          />
          <div>
            <h2
              onClick={() => handleProfileClick(videoById.owner)}
              className="cursor-pointer text-base"
            >
              {videoById.owner?.fullName}
            </h2>

            <h4 className="text-[#a9a9a9] text-sm">
              {user.subscriberCount} subscribers
            </h4>
          </div>

          <div onClick={handleSubscription}>
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
              onClick={toggleLikes}
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
              {isSaved ? (
                <i onClick={saveVideo} class="fa-solid fa-bookmark pr-2"></i>
              ) : (
                <i onClick={saveVideo} class="fa-regular fa-bookmark pr-2"></i>
              )}
            </p>
          </div>
        </div>

        {/* Desktop layout  */}

        <div className="hidden sm:flex flex-col md:flex-row justify-between items-start md:items-center gap-3 my-4">
          <div className="flex items-center gap-3">
            <img
              onClick={() => handleProfileClick(videoById.owner)}
              className="h-10 w-10 rounded-full cursor-pointer"
              src={videoById?.owner?.avatar}
              alt="channel avatar"
            />
            <div>
              <h2
                onClick={() => handleProfileClick(videoById.owner)}
                className="cursor-pointer text-base"
              >
                {videoById.owner?.fullName}
              </h2>
              <h4 className="text-[#a9a9a9] text-sm">
                {user.subscriberCount}{" "} 
                subscribers
              </h4>
            </div>

            <div onClick={handleSubscription}>
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
                onClick={toggleLikes}
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
            {isSaved ? (
              <p
                onClick={()=>saveVideo(videoId)}
                className="rounded-full px-4 py-1 bg-[#343434] cursor-pointer text-sm"
              >
                <i class="fa-solid fa-bookmark pr-2"></i>
                Saved
              </p>
            ) : (
              <p
                onClick={()=>saveVideo(videoId)}
                className="rounded-full px-4 py-1 bg-[#343434] cursor-pointer text-sm"
              >
                <i  class="fa-regular fa-bookmark pr-2"></i>
                Save
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#3f3f3f] p-3 rounded-xl mb-6 text-sm ">
          <div className="flex gap-4 mb-2">
            <p>{views || videoById.views}{" "} views</p>
            <p>{moment(videoById.createdAt).fromNow()}</p>
          </div>
          <p>{videoById.description}</p>
        </div>

        <div>
          <Comment message={videoById} />
        </div>
      </div>

      <div className="w-full lg:w-[30%]">
        <Video />
      </div>
    </motion.div>
  );
};

export default WatchPage;
