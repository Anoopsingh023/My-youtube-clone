import React from "react";
import { useUserVideos } from "../context/VideoContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../utils/constant";
import upload2 from "../../assets/upload2.svg";
import { toast } from "react-toastify";

const UserVideos = () => {
  const navigate = useNavigate();
  const { filteredVideos, handleSort, sortKey, sortOrder, refetch } =
    useUserVideos();

  const renderSortIcon = (key) => {
    if (sortKey !== key) return "⇅";
    return sortOrder === "asc" ? "▲" : "▼";
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${base_url}/api/v1/videos/v/${videoId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      toast("Video deleted successfully.");
      refetch();
    } catch (error) {
      // console.error("Error deleting video:", error);
      toast.error("Failed to delete the video.");
    }
  };

  const handleUpdate = (video) => {
    navigate(
      `/channel/${localStorage.getItem("userName")}/update-video/${video._id}`,
      { state: { video } }
    );
  };

  const handleUploadVideo = () => {
    navigate(`/channel/${localStorage.getItem("userName")}/upload-video`);
  };

  return (
    <div className="p-4">
      {/* Table for medium+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse shadow-md rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Video</th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("title")}>
                Title {renderSortIcon("title")}
              </th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Date {renderSortIcon("createdAt")}
              </th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("views")}>
                Views {renderSortIcon("views")}
              </th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("likes")}>
                Likes {renderSortIcon("likes")}
              </th>
              <th className="p-4">Update</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => (
              <tr key={video._id} className="border-b">
                <td className="p-4">
                  <img
                    className="w-32 h-20 object-cover rounded-md"
                    src={video.thumbnail}
                    alt="thumbnail"
                  />
                </td>
                <td className="p-4">{video.title}</td>
                <td className="p-4">
                  {new Date(video.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">{video.views}</td>
                <td className="p-4">👍 {video.totalLikes || 0}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleUpdate(video)}
                    className="px-4 py-2 border rounded hover:bg-[#272626] cursor-pointer"
                  >
                    Update
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="px-3 py-2 border rounded hover:bg-[#272626] cursor-pointer"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="grid gap-4 md:hidden">
        {filteredVideos.map((video) => (
          <div
            key={video._id}
            className="border rounded-lg p-4 shadow-md bg-[#1e1e1e]"
          >
            <img
              className="w-full h-40 object-cover rounded-md"
              src={video.thumbnail}
              alt="thumbnail"
            />
            <div className="mt-3">
              <p className="text-lg font-semibold">{video.title}</p>
              <p className="text-sm text-gray-400">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">Views: {video.views}</p>
              <p className="text-sm">👍 {video.totalLikes || 0}</p>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleUpdate(video)}
                className="px-4 py-2 border rounded hover:bg-[#272626] cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="px-3 py-2 border rounded hover:bg-[#272626] cursor-pointer"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="w-full mt-5 flex justify-center items-center">
        <div>
          <img
            onClick={handleUploadVideo}
            className="h-50 w-50 m-4 cursor-pointer"
            src={upload2}
            alt="Upload"
          />
          <div className="mx-4 flex justify-center px-4 py-2 cursor-pointer hover:bg-[#272626] duration-300 rounded-xl">
            <button onClick={handleUploadVideo} className="cursor-pointer">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVideos;
