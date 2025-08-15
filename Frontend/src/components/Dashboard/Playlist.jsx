import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { base_url } from "../../utils/constant";

const Playlist = () => {
  const { playlistId } = useParams();

  const [user, setUser] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const playlist = state?.playlist;
  console.log("Playlist on playlist", playlist);
  const userId = playlist.owner;

  useEffect(() => {
    fetchUserProfile();
    isPlaylistInWatchLater();
  }, []);

  const fetchUserProfile = () => {
    axios
      .get(`${base_url}/api/v1/users/u/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("User on playlist", res.data);
        setUser(res.data.data);
      })
      .catch((err) => {
        // console.error("Error user on playlist", err);
      });
  };

  const savePlaylist = () => {
    axios
      .post(
        `${base_url}/api/v1/users/playlist/${playlistId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Saved playlist", res.data);
        isPlaylistInWatchLater();
      })
      .catch((err) => {
        // console.error("Error Saving playlist", err);
      });
  };

  const isPlaylistInWatchLater = () => {
    axios
      .get(`${base_url}/api/v1/users/playlist/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("is Already in playlist", res.data);
        setIsSaved(res.data.data.isAdded);
      })
      .catch((err) => {
        // console.error("Error is already in  playlist", err);
      });
  };

  const handelVideoClick = (videoId) => {
    navigate(`/dashboard/video/${videoId}`);
  };

  const handleProfileClick = (username) => {
    navigate(`/dashboard/${username}`);
  };

  if (!playlist)
    return <p className="text-white text-center mt-10">Playlist not found</p>;

  return (
    <div className="flex  text-white h-screen overflow-hidden gap-2">
      {/* Fixed Left Sidebar */}
      <div className="hidden bg-[#644e3e] md:flex md:flex-col md:w-1/3 lg:w-1/4 px-4 py-6 border-r border-gray-800 fixed h-full rounded-xl">
        <img
          src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
          alt="playlist-thumbnail"
          className="rounded-xl w-full aspect-video object-cover mb-4"
        />
        <h1 className="text-xl font-bold mb-2">{playlist.name}</h1>
        <div className="flex flex-row gap-2 items-center">
          <img
            src={user.avatar}
            onClick={() => handleProfileClick(user.username)}
            className="h-15 w-15 rounded-full cursor-pointer"
            alt="avatar"
          />
          <h2
            onClick={() => handleProfileClick(user.username)}
            className="cursor-pointer"
          >
            {user.fullName}
          </h2>
        </div>
        <p className="text-gray-400 text-sm mb-2">
          Playlist • {playlist.videos.length} videos • Created{" "}
          {moment(playlist.createdAt).fromNow()}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          {playlist.description || "No description provided."}
        </p>
        <button
          onClick={() => handelVideoClick(playlist.videos?.[0]?._id)}
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-[#dbd9d9fc]"
        >
          Play All
        </button>
        {isSaved ? (
          <span>
            <i
              onClick={savePlaylist}
              class="fa-solid fa-bookmark hover:bg-[#424242] p-4 rounded-full cursor-pointer"
            ></i>
          </span>
        ) : (
          <span>
            <i
              onClick={savePlaylist}
              class="fa-regular fa-bookmark hover:bg-[#424242] p-4 rounded-full cursor-pointer"
            ></i>
          </span>
        )}
      </div>

      {/* Scrollable Right Content */}
      <div className="flex-1 md:ml-[43.33%] lg:ml-[31%] px-4 py-6 overflow-y-auto h-full space-y-1">
        {playlist.videos.map((video, index) => (
          <div
            key={video._id}
            className="flex flex-col sm:flex-row gap-1 items-start  cursor-pointer hover:bg-[#7a797925] rounded-xl p-2"
          >
            <p>{index + 1}</p>
            <img
              src={video.thumbnail}
              onClick={() => handelVideoClick(video._id)}
              alt="video-thumb"
              className="w-full sm:w-48 rounded-lg aspect-video object-cover mr-2"
            />
            <div className="flex flex-col flex-1">
              <h2
                onClick={() => handelVideoClick(video._id)}
                className="text-base font-medium mb-1 line-clamp-2"
              >
                {video.title}
              </h2>
              <div className="flex flex-row text-sm text-gray-400 gap-1">
                <h2
                  onClick={() => handleProfileClick(user.username)}
                  className="hover:text-white "
                >
                  {user.fullName}
                </h2>
                <p>
                  {" "}
                  • {video.views} views • {moment(video.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
