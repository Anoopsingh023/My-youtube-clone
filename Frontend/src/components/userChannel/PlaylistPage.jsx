import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserVideos } from "../context/VideoContext";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../../utils/constant";
import plus from "../../assets/plus.svg";

const PlaylistPage = () => {
  const { filteredVideos } = useUserVideos();
  const { playlistId } = useParams();

  const [open, setOpen] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playlistById, setPlaylistById] = useState("");
  const [playlistVideos, setPlaylistVideos] = useState([]);

  useEffect(() => {
    fetchPlaylistById(playlistId);
  }, []);

  const fetchPlaylistById = (playlistId) => {
    axios
      .get(`${base_url}/api/v1/playlists/user/p/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const videos = res.data || [];
        setPlaylistById(videos.data);
        setPlaylistVideos(videos.data.videos);
      })
      .catch((err) => {
        // console.error("Error playlist by Id", err);
        toast.error("Somthing went wrong")
      });
  };

  const toggleVideo = (id) => {
    setSelectedVideos((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
  };

  const handleAddVideosToPlaylist = (playlistId) => {
    if (!selectedVideos.length) {
      toast.error("Select at least one video");
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
      .then(() => {
        fetchPlaylistById(playlistId);
        toast("Video added successfully")
      })
      .catch((err) => {
        // console.error("Error Add video to playlist ", err);
        toast.error("Failed to add video to playlist")
      });
  };

  const handleRemoveVideoFromPlaylist = (videoId) => {
    if (!window.confirm("Are you sure you want to remove this video?")) return;

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
      .then(() => {
        toast("Video removed successfully");
        fetchPlaylistById(playlistId);
      })
      .catch((err) => {
        // console.error("Error video remove from playlist", err);
        toast.error("Failed to remove video")
      });
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col">
      {/* Playlist Info */}
      <div className="flex flex-col items-center text-center">
        <h4 className="text-lg sm:text-xl font-semibold">
          {playlistById.name}
        </h4>
        <p className="text-sm sm:text-base">{playlistById.description}</p>
        <p className="text-xl sm:text-2xl mt-5">Playlist videos</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border-collapse shadow-md rounded-xl overflow-hidden text-sm sm:text-base">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 sm:p-4">Video</th>
              <th className="p-2 sm:p-4">Title</th>
              <th className="p-2 sm:p-4">Views</th>
              <th className="p-2 sm:p-4">Remove</th>
            </tr>
          </thead>
          <tbody>
            {playlistVideos.map((video) => (
              <tr key={video._id} className="border-b">
                <td className="p-2 sm:p-4">
                  <img
                    className="w-24 sm:w-32 h-16 sm:h-20 object-cover rounded-md"
                    src={video.thumbnail}
                    alt="thumbnail"
                  />
                </td>
                <td className="p-2 sm:p-4">{video.title}</td>
                <td className="p-2 sm:p-4">{video.views}</td>
                <td className="p-2 sm:p-4">
                  <button
                    onClick={() => handleRemoveVideoFromPlaylist(video._id)}
                    className="px-2 sm:px-3 py-1 sm:py-2 border rounded hover:bg-[#272626] cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Video Button */}
      <div className="w-full mt-5 flex justify-center items-center flex-col sm:flex-col gap-3">
        <img
          onClick={() => setOpen(true)}
          className="h-14 w-14 sm:h-30 sm:w-30 cursor-pointer"
          src={plus}
          alt="Add"
        />
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 border rounded hover:bg-[#272626] duration-300"
        >
          Add Video
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-[#1e1e1e] w-full sm:w-1/2 max-w-2xl rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
            >
              &times;
            </button>

            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Add Video
            </h2>

            <div className="max-h-[60vh] overflow-y-auto">
              {filteredVideos.map((video) => (
                <label
                  key={video._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 border-b pb-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video._id)}
                    onChange={() => toggleVideo(video._id)}
                  />
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="w-32 h-20 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base">{video.title}</h4>
                    <p className="text-xs sm:text-sm">{video.views} views</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  handleAddVideosToPlaylist(playlistId);
                  setOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
