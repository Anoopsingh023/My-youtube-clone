import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Comment from "../comment/Comment";
import Video from "../hooks/Video";

const VideoPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const video = state?.video;
  console.log("video-page", video);

  useEffect(() => {
    getChannelProfile();
  }, [video.owner.username]);

  const getChannelProfile = () => {
    axios
      .get(`http://localhost:8000/api/v1/users/c/${video.owner.username}`, {
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

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  const handleSubscription = (userId) => {
    toggleSubscription(userId);
  };

  if (!video) return <p>Video not found</p>;

  return (
    <div className="flex flex-row text-white m-5 gap-5 pb-40">
      <div className="w-[70%]">
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
              <p className="border-r-1 border-[#767776] pr-3 ">
                <i class="fa-regular fa-thumbs-up"></i> Likes
              </p>
              <p>
                <i class="fa-regular fa-thumbs-down"></i>
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
            <p>{video.views} views</p>
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

        <div>{<Comment message={video}/>}</div>
      </div>
      <div className=" w-[30%]"><Video/></div>
    </div>
  );
};

export default VideoPage;
