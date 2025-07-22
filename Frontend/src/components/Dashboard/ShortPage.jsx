import React from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";

const ShortPage = () => {
  const { state } = useLocation();
  const video = state?.video;

  if (!video) return <p className="text-white">Short video not found</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-[420px] flex flex-col items-center p-2">
        <video
          src={video.videoFile}
          className="rounded-xl w-full aspect-[9/16] object-cover"
          controls
          autoPlay
          loop
        />

        <div className="mt-3 text-center">
          <h1 className="text-lg font-semibold mb-1 px-2">{video.title}</h1>
          <p className="text-sm text-gray-400 mb-2 px-2">
            {moment(video.createdAt).fromNow()} • {video.views} views
          </p>
        </div>

        <div className="flex justify-around w-full mt-3 px-4">
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <i className="fa-regular fa-thumbs-up text-lg mb-1"></i>
            <span>Like</span>
          </div>
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <i className="fa-regular fa-thumbs-down text-lg mb-1"></i>
            <span>Dislike</span>
          </div>
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <i className="fa-solid fa-share text-lg mb-1"></i>
            <span>Share</span>
          </div>
          <div className="flex flex-col items-center text-sm cursor-pointer">
            <i className="fa-solid fa-download text-lg mb-1"></i>
            <span>Download</span>
          </div>
        </div>

        <div className="flex gap-3 items-center mt-6 px-4 w-full">
          <img
            className="h-10 w-10 rounded-full cursor-pointer"
            src={video.owner.avatar}
            alt="channel avatar"
          />
          <div className="flex-1">
            <h2 className="text-base font-medium">{video.owner.fullName}</h2>
            <p className="text-sm text-gray-400">
              {video.owner.subscriberCount} subscribers
            </p>
          </div>
          <button className="bg-white text-black px-4 py-1 rounded-full text-sm">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortPage;
