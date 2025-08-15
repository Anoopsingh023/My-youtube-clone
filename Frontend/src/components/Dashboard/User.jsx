import React, { useState, useEffect } from "react";
import Video from "./Video";
import useHistory from "../hooks/useHistory";
import useUserPlaylist from "../hooks/useUserPlaylist";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { base_url } from "../../utils/constant";
import {TvMinimalPlay} from "lucide-react"

const User = () => {
  const avatar = localStorage.getItem("avatar");
  const fullName = localStorage.getItem("name");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  const { history, removevideo, clearHistory } = useHistory();
  const [SavedPlaylists, setSavedplaylists] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLiked, setIsLiked] = useState(false)

  const navigate = useNavigate();

  const fetchSavedPlaylist = async () => {
    try {
      const res = await axios.get(`${base_url}/api/v1/users/watch-later`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Saved Playlist:", res.data);
      setSavedplaylists(res.data.data);
    } catch (error) {
      console.error(
        "Error fetching saved playlist",
        error.response?.data || error.message
      );
    }
  };


  const fetchLikedVideos = async () => {
    try {
      const res = await axios.get(`${base_url}/api/v1/likes/liked-videos`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("Likes", res.data);
      setLikedVideos(res.data.data.likedVideos);
    } catch (error) {
      console.error("liked video error", error);
    }
  };
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLiked(true)
      fetchSavedPlaylist()
      fetchLikedVideos();
    }
  }, []);

  const handleplaylistClick = (playlist) => {
    navigate(`/dashboard/playlist/${playlist._id}`, { state: { playlist } });
  };

  const handleClick = (videoId) => {
    navigate(`/dashboard/video/${videoId}`);
  };

  const handleProfileClick = (owner) => {
    navigate(`/dashboard/${owner.username}`);
  };

  const handleHistoryClick = () => {
    navigate(`/dashboard/history`);
  };

  const handleViewPlaylist = ()=>{
    navigate(`/dashboard/saved-playlist`)
  }

  const handleLikedView = ()=>{
    navigate(`/dashboard/liked-videos`)
  }

  const handleLogClick = () => {
    navigate(`/login`);
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <>
    {isLiked ? <div>
      <div className="flex flex-row  gap-4">
        <img src={avatar} alt="avatar" className="h-30 w-30 rounded-full" />
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl">{fullName}</h2>
          <p>@{userName}</p>
        </div>
      </div>

      {/* History */}
      <div className="p-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl m-4 font-medium">History</h2>
          <button
            onClick={handleHistoryClick}
            className="my-3 font-medium border border-[#858484] px-4 rounded-full hover:bg-[#212121] cursor-pointer"
          >
            View All
          </button>
        </div>
        <Slider {...settings}>
          {history.map((video) => (
            <div
              key={video.video._id}
              className="  p-2 text-white cursor-pointer rounded-2xl  duration-600"
            >
              <img
                onClick={() => handleClick(video.video._id)}
                className="h-54 w-full object-cover rounded-xl"
                src={video.video.thumbnail}
                alt="thumbnail"
              />
              <div className="flex  p-2 items-center">
                <img
                  onClick={() => handleProfileClick(video.video.owner)}
                  className="h-10 w-10 mr-3 rounded-4xl"
                  src={video.video.owner.avatar}
                  alt="avatar"
                />
                <div className="w-[90%] font-medium ">
                  <h2
                    onClick={() => handleClick(video.video._id)}
                    className="text-xl"
                  >
                    {video.video.title}
                  </h2>
                  <h2
                    onClick={() => handleProfileClick(video.video.owner)}
                    className="text-[#6e6e6e] hover:text-white duration-300 w-fit "
                  >
                    {video.video.owner.fullName}
                  </h2>
                  <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                    <h2 onClick={() => handleClick(video.video._id)}>
                      {video.video.views} views
                    </h2>
                    <p onClick={() => handleClick(video.video._id)}>&#x2022;</p>
                    <div onClick={() => handleClick(video.video._id)}>
                      {video.video.createdAt ? (
                        <p>
                          {formatDistanceToNow(
                            new Date(video.video.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
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
        </Slider>
      </div>

      {/* Playlist */}
      <div className="p-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl m-4 font-medium">Playlist</h2>
          <button
            onClick={handleViewPlaylist}
            className="my-3 font-medium border border-[#858484] px-4 rounded-full hover:bg-[#212121] cursor-pointer"
          >
            View All
          </button>
        </div>

        <Slider {...settings}>
          {SavedPlaylists.length === 0 ? (
            <div className="text-gray-500">No playlists in Watch Later.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SavedPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-3 flex flex-col hover:shadow-lg transition"
                >
                  <div
                    onClick={() => handleplaylistClick(playlist)}
                    className="cursor-pointer"
                  >
                    {playlist.videos.length > 0 ? (
                      <img
                        src={playlist.videos[0].thumbnail}
                        alt="Playlist Thumbnail"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                        No Videos
                      </div>
                    )}

                    <h3 className="text-lg font-medium truncate">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {playlist.videos.length} video
                      {playlist.videos.length !== 1 && "s"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Slider>
      </div>

      {/* Liked Videos */}
      <div className="p-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl m-4 font-medium">Liked Videos</h2>
          <button
            onClick={handleLikedView}
            className="my-3 font-medium border border-[#858484] px-4 rounded-full hover:bg-[#212121] cursor-pointer"
          >
            View All
          </button>
        </div>
        <Slider {...settings}>
          {likedVideos.map((video) => (
            <div
              key={video.video._id}
              className="  p-2 text-white cursor-pointer rounded-2xl  duration-600"
            >
              <img
                onClick={() => handleClick(video.video._id)}
                className="h-54 w-full object-cover rounded-xl"
                src={video.video.thumbnail}
                alt="thumbnail"
              />
              <div className="flex  p-2 items-center">
                <img
                  onClick={() => handleProfileClick(video.video.owner)}
                  className="h-10 w-10 mr-3 rounded-4xl"
                  src={video.video.owner.avatar}
                  alt="avatar"
                />
                <div className="w-[90%] font-medium ">
                  <h2
                    onClick={() => handleClick(video.video._id)}
                    className="text-xl"
                  >
                    {video.video.title}
                  </h2>
                  <h2
                    onClick={() => handleProfileClick(video.video.owner)}
                    className="text-[#6e6e6e] hover:text-white duration-300 w-fit "
                  >
                    {video.video.owner.fullName}
                  </h2>
                  <div className="flex flex-row gap-1 items-center text-[#6e6e6e] ">
                    <h2 onClick={() => handleClick(video.video._id)}>
                      {video.video.views} views
                    </h2>
                    <p onClick={() => handleClick(video.video._id)}>&#x2022;</p>
                    <div onClick={() => handleClick(video.video._id)}>
                      {video.video.createdAt ? (
                        <p>
                          {formatDistanceToNow(
                            new Date(video.video.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
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
        </Slider>
      </div>
    </div>: (
      <div className="h-full flex flex-col justify-center items-center gap-4">
          {/* <HistoryIcon size={100}/> */}
          <TvMinimalPlay size={100}/>
          <h2 className="text-4xl">Keep track of what you watch</h2>
          <p className="">
            Watch history isn't viewable when you're signed out
          </p>
          <button
            onClick={handleLogClick}
            className="border bg-[#232323] py-2 px-4 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
          >
            <i class="fa-regular fa-user"></i> Sign in
          </button>
        </div>
    )}
    </>
  );
};

export default User;
