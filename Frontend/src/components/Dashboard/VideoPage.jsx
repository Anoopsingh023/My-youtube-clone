import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Comment from "../comment/Comment";
import Video from "./Video";
import { toast } from "react-toastify";
import { base_url } from "../../utils/constant";

const VideoPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [likes, setLikes] = useState("");
  const [isLikedByUser, setIsLikedByUser] = useState("")
  const [isDisliked, setIsDislike] = useState(false)
  const [views, setViews] = useState("")

  const video = state?.video;
  console.log("video-page", video);

  useEffect(() => {
    getChannelProfile();
    getTotalLikes();
    isVideoLiked();
    getvideoViews()
  }, [video.owner.username, video._id]);

  const getvideoViews = ()=>{
    axios
    .put(`${base_url}/api/v1/videos/views/${video._id}`,{
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        },
      })
      .then((res)=>{
        console.log("Video views", res.data)
        setViews(res.data.data.views)
      })
      .catch((err)=>{
        console.log("Video views error", err)
      })
  }

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
        isVideoLiked()
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
        setIsLikedByUser(res.data.data.isLiked)
      })
      .catch((err) => {
        console.log("isLikedError", err);
        toast.error("Login not required");
      });
  };

  const handleLikes = (videoId) => {
    toggleLikes(videoId);
  };

  const handleDiskie = () =>{
    setIsDislike(!isDisliked)
  }

  console.log("videoId", video._id);

  if (!video) return <p>Video not found</p>;

  return (
    <div className="flex flex-row text-white m-5 gap-5 pb-40">
      <div className="w-[65%]">
        <video src={video.videoFile} controls className="rounded-2xl" />
        <h1 className="text-white text-xl font-medium">
          {video.title} Lorem ipsum, dolor sit amet consectetur adipisicing
          elit. Amet, cum!
        </h1>

        <div className="flex flex-row items-center m-3 place-content-between">
          <div className="flex flex-row items-center m-3 gap-3">
            <img
              onClick={() => handleProfileClick(video.owner)}
              className="h-10 w-10 rounded-4xl cursor-pointer"
              src={video.owner.avatar}
              alt="channel avatar"
            />
            <div>
              <h2
                onClick={() => handleProfileClick(video.owner)}
                className="cursor-pointer"
              >
                {video.owner.fullName}
              </h2>
              <h4 className="text-[#a9a9a9]">
                {user.subscriberCount} subscribers
              </h4>
            </div>
            <div onClick={() => handleSubscription(user._id)}>
              {user.isSubscribed ? (
                <>
                  <h4 className=" rounded-4xl px-4 py-1 w-fit cursor-pointer bg-[#343434]">
                    <i class="fa-solid fa-bell mr-2"></i> Subscribed
                  </h4>
                </>
              ) : (
                <>
                  <h4 className="rounded-4xl px-4 py-1 w-fit cursor-pointer bg-[#eaeaea] text-[#000000] ">
                    Subscribe
                  </h4>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center m-3 gap-3">
            <div className="flex flex-row gap-3 rounded-4xl px-4 py-1 w-fit cursor-pointer bg-[#343434]">
              <p
                onClick={() => handleLikes(video._id)}
                className="border-r-1 border-[#767776] pr-3 "
              >
                {isLikedByUser ?(<i class="fa-solid fa-thumbs-up"></i>):(<i class="fa-regular fa-thumbs-up"></i>)} {likes}
              </p>
              <p onClick={()=>handleDiskie(video._id)}>
                {isDisliked?(<i class="fa-solid fa-thumbs-down"></i>):<i class="fa-regular fa-thumbs-down"></i>}
              </p>
            </div>
            <p className="rounded-4xl px-4 py-1 w-fit cursor-pointer bg-[#343434]">
              <i class="fa-solid fa-share pr-3"></i>Share
            </p>
            <p className="rounded-4xl px-4 py-1 w-fit cursor-pointer bg-[#343434]">
              <i class="fa-solid fa-download pr-3"></i>Download
            </p>
          </div>
        </div>

        {/* ========Discription======== */}
        <div className="bg-[#3f3f3f] flex flex-col p-2 rounded-xl mb-7 ">
          <div className="flex flex-row gap-4">
            <p>{views} views</p>
            <p>{moment(video.createdAt).fromNow()}</p>
          </div>
          <p>
            {video.description} Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Maiores cumque iste totam sint ipsam laudantium,
            obcaecati, vitae ducimus tempore fugit alias dolores nemo rerum
            facilis itaque fuga nam similique incidunt?
          </p>
        </div>

        {/* =======Comment======= */}

        <div>{<Comment message={video} />}</div>
      </div>
      <div className=" w-[30%]">
        <Video />
      </div>
    </div>
  );
};

export default VideoPage;
