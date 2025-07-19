import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { useUserVideos } from "../context/VideoContext";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../utils/constant";

const PlaylistPage = () => {
  const { filteredVideos } = useUserVideos();
  const { playlistId } = useParams();

  const [open, setopen] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playlistById, setPlaylistById] = useState("");
  const [platlistVideos, setPlaylistVideos] = useState([]);

  useEffect(() => {
    fetchPlaylistById(playlistId);
  }, []);

  const fetchPlaylistById = (playlistId) => {
    axios
      .get(`${base_url}/api/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Playlist by Id", res.data);
        const videos = res.data || [];
        setPlaylistById(videos.data);
        setPlaylistVideos(videos.data.videos);
      })
      .catch((err) => {
        console.error("Error playlist by Id", err);
      });
  };

  // Toggle video selection
  const toggleVideo = (id) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
  };

  const handleAddVideosToPlaylist = (playlistId) => {
    if (!selectedVideos.length) {
      alert("select atleast one video");
      return;
    }

    const videoParam = selectedVideos.join(",");
    axios
      .post(
        `${base_url}/api/v1/playlists/add/${playlistId}/add-videos?videoIds=${videoParam}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("Added videos to playlist", res.data);
        fetchPlaylistById(playlistId);
      })
      .catch((err) => {
        console.error("Error Add video to playlist ", err);
      });
  };

  const handelRemoveVideoFromPlaylist = (videoId) => {
    if (!window.confirm("Are you sure you want to this this video?")) return;

    axios
      .patch(
        `${base_url}/api/v1/playlists/remove/${videoId}/${playlistId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("Video removed from playlist", res.data);
        // alert("Video removed successfully");
        toast("Video removed successfully");
        fetchPlaylistById(playlistId);
      })
      .catch((err) => {
        console.error("Error video remove from playlist", err);
      });
  };

  return (
    <div className="p-6 flex flex-col">
      <div className="flex flex-col items-center">
        <h4>{playlistById.name}</h4>
        <p>{playlistById.description}</p>
        <p className="text-2xl mt-5">Playlist videos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse  shadow-md rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Video</th>
              <th className="p-4 cursor-pointer">Title</th>
              <th className="p-4 cursor-pointer">Views</th>
              <th className="p-4">Remove</th>
            </tr>
          </thead>
          <tbody>
            {platlistVideos.map((video) => (
              <tr key={video._id} className="border-b ">
                <td className="p-4">
                  <img
                    className="w-32 h-20 object-cover rounded-md"
                    src={video.thumbnail}
                    alt="thumbnail"
                  />
                </td>
                <td className="p-4">{video.title}</td>

                <td className="p-4">{video.views}</td>
                <td className="p-4">
                  <button
                    onClick={() => handelRemoveVideoFromPlaylist(video._id)}
                    className="px-3 py-2 border rounded hover:bg-[#272626] cursor-pointer"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" w-full  mt-5 flex justify-center items-center">
        <div>
          <img
            onClick={() => setopen(true)}
            className="h-50 w-50 m-4 cursor-pointer"
            src="../../src/assets/plus.svg"
            alt=""
          />
          <div className="mx-4  flex justify-center px-4 py-2 cursor-pointer hover:bg-[#272626] duration-300 rounded-xl">
            <button onClick={() => setopen(true)} className="cursor-pointer">
              Add Video
            </button>
          </div>
        </div>

        {/* Add Video in Playlist */}

        {open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm"
            onClick={(e) => {
              // Close when clicking outside the modal box
              if (e.target.classList.contains("modal-overlay")) {
                setopen(false);
              }
            }}
          >
            <div className="modal-overlay flex items-center justify-center w-full h-full">
              <div className="animate-fade-in bg-[#1e1e1e] w-1/2 max-w-2xl rounded-2xl shadow-lg p-6 border border-gray-700 relative">
                {/* Close icon */}
                <button
                  onClick={() => {
                    setopen(false);
                  }}
                  className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
                >
                  &times;
                </button>

                <h2 className="text-xl font-semibold text-white mb-4">
                  Add Video
                </h2>

                {filteredVideos.map((video) => (
                  <label className="flex flex-row" key={video._id}>
                    <input
                      type="checkbox"
                      className="p-4"
                      checked={selectedVideos.includes(video._id)}
                      onChange={() => toggleVideo(video._id)}
                    />
                    <img
                      src={video.thumbnail}
                      alt="thumbnail"
                      className="w-50 h-30 my-1 mx-4 rounded-xl object-cover"
                    />
                    <div className="flex flex-col justify-center">
                      <h4>{video.title}</h4>
                      <p>{video.views} views</p>
                    </div>
                  </label>
                ))}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="submit"
                    onClick={() => {
                      handleAddVideosToPlaylist(playlistId);
                      setopen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setopen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
