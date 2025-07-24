import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import useUserPlaylist from "../hooks/useUserPlaylist";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useUserVideos from "../hooks/useUserVideos";
import { base_url } from "../../utils/constant";

const ChannelProfile = () => {
  const { username } = useParams();
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getChannelProfile();
  }, [username]);

  const { playlists } = useUserPlaylist(userId);
  // const { userVideo} = useUserVideos(userId)

  console.log("Playlist on profile", playlists);
  // console.log("Videos on profile", userVideo);

  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  const getuserVideo = (userId) => {
    axios
      .get(`${base_url}/api/v1/videos/u/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Channel's videos", res.data);
        const videoData = res.data?.data?.[0]; // null-safe access
        const video = videoData?.video || []; // fallback to empty array
        setVideos(video.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getChannelProfile = () => {
    axios
      .get(`${base_url}/api/v1/users/c/${username}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Channel Profile", res.data);
        const userData = res.data.data;
        setUser(res.data.data);
        getuserVideo(userData._id);
        setUserId(userData._id);
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
      });
  };

  const handleSubscription = (userId) => {
    toggleSubscription(userId);
  };

  const handleVideoClick = (video) => {
    navigate("/dashboard/video-page", { state: { video } });
  };

  const handlePlaylist = (playlist) =>{
    navigate(`/dashboard/playlist/${playlist._id}`,{state: {playlist, user}})
  }

  

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col">
        <img
          className="h-35 m-5 mb-0 text-white object-cover"
          src={user.coverImage || null}
          alt="cover image"
        />
        <div className="flex flex-row m-5 p-3 items-center">
          <img
            className="h-35 w-35 mr-5 rounded-[50%] object-cover"
            src={user.avatar}
            alt="avatar"
          />
          <div className="flex flex-col gap-2 text-white ">
            <h2 className="text-5xl">{user.fullName}</h2>
            <div className=" flex flex-row gap-1">
              <p>@{user.username}</p>
              <p className="text-[#afa8a8]">&#x2022;</p>
              <p className="text-[#afa8a8]">
                {user.subscriberCount} subscribers
              </p>
            </div>
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
          {["Home", "Videos", "Playlist", "Tweets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 ${
                activeTab === tab ? "border-[#5a5959]" : "border-black"
              } hover:border-[#5a5959] duration-300 px-2 pb-2 mb-1 cursor-pointer`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <hr className="text-[#6e6e6e]" />

      <div className="p-5 pb-40 text-white">
        {activeTab === "Home" && (
          <div>
            {/* <div className="flex flex-row gap-4 p-2">
              <video src={videos[0].videoFile} className="h-60 rounded-2xl" controls></video>
              <div>
                <h4 className="text-xl">{videos[0].title}</h4>
                <div className="flex flex-row gap-1 items-center text-[#6e6e6e]">
                  <p>{videos[0].views} views</p>
                  <p>&#x2022;</p>
                  <p>
                    {moment(videos[0].createdAt).fromNow()}
                  </p>
                </div>
                <p className="text-md">{videos[0].description}</p>
              </div>
            </div> */}
            {/* <hr className="text-[#6e6e6e]" /> */}
            <div>
              <h4 className="m-4 text-2xl font-medium">Videos</h4>

              <Slider {...settings}>
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div
                      onClick={() => handleVideoClick(video)}
                      key={video._id}
                      className="p-2 cursor-pointer rounded-2xl hover:bg-[#abaaaa27] duration-600"
                    >
                      <img
                        className="w-full aspect-video object-cover rounded-xl"
                        src={video.thumbnail}
                        alt="thumbnail"
                      />
                      <div className="flex flex-col p-2 font-medium">
                        <h2 className="text-xl">{video.title}</h2>
                        <div className="flex flex-row gap-1 items-center text-[#6e6e6e]">
                          <h2>{video.views} views</h2>
                          <p>&#x2022;</p>
                          <p>{moment(video.createdAt).fromNow()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                    
                  </div>
                )}
              </Slider>
            </div>

            <div>
              <h4 className="m-4 text-2xl font-medium">Playlists</h4>

              <Slider {...settings}>
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="p-2 cursor-pointer rounded-2xl hover:bg-[#5c5b5b25] duration-300"
                    >
                      {playlist.videos.length > 0 ? (
                        <img
                          src={playlist.videos[0].thumbnail}
                          alt="thumbnail"
                          className="w-full aspect-video object-cover rounded-xl"
                        />
                      ) : (
                        <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                          No Video
                        </div>
                      )}

                      <div className="flex flex-col p-2 font-medium text-white">
                        <h2 className="text-lg md:text-xl">{playlist.name}</h2>
                        <p className="text-sm text-gray-400 hover:text-white">
                          View full playlist
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                    
                  </div>
                )}
              </Slider>
            </div>
          </div>
        )}

        {activeTab === "Videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  onClick={() => handleVideoClick(video)}
                  key={video._id}
                  className="p-2 cursor-pointer rounded-2xl hover:bg-[#abaaaa27] duration-600"
                >
                  <img
                    className="w-full aspect-video object-cover rounded-xl"
                    src={video.thumbnail}
                    alt="thumbnail"
                  />
                  <div className="flex flex-col p-2 font-medium">
                    <h2 className="text-xl">{video.title}</h2>
                    <div className="flex flex-row gap-1 items-center text-[#6e6e6e]">
                      <h2>{video.views} views</h2>
                      <p>&#x2022;</p>
                      <p>{moment(video.createdAt).fromNow()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                No Videos
              </div>
            )}
          </div>
        )}

        {activeTab === "Playlist" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  onClick={()=>handlePlaylist(playlist)}
                  className="p-2 cursor-pointer rounded-2xl hover:bg-[#5c5b5b25] duration-300"
                >
                  {playlist.videos.length > 0 ? (
                    <img
                      src={playlist.videos[0].thumbnail}
                      onClick={()=>handlePlaylist(playlist)}
                      alt="thumbnail"
                      className="w-full aspect-video object-cover rounded-xl"
                    />
                  ) : (
                    <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                      No Playlists
                    </div>
                  )}

                  <div className="flex flex-col p-2 font-medium text-white">
                    <h2 className="text-lg md:text-xl">{playlist.name}</h2>
                    <p onClick={()=>handlePlaylist(playlist)}
                     className="text-sm text-gray-400 hover:text-white">View full playlist</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 w-full flex items-center justify-center bg-[#1f1f1f] text-gray-400 italic rounded-xl">
                No Playlist
              </div>
            )}
          </div>
        )}

        {activeTab === "Tweets" && (
          <div>
            <h2 className="text-2xl mb-4">User’s Tweets or Posts</h2>
            {/* Add tweet content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelProfile;
