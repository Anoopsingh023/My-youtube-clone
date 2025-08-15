import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserVideos } from "../context/VideoContext";
import { toast } from "react-toastify";
import { base_url } from "../../utils/constant";

const UpdateUserVideo = () => {
  const { state } = useLocation();
  const { refetch } = useUserVideos();
  const navigate = useNavigate();
  const dropRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const video = state?.video;

  useEffect(() => {
    setDescription(video.description);
    setTitle(video.title);
    setThumbnail(video.thumbnail);
  }, []);

  const thumbnailFileHandler = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    thumbnailFileHandler(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    if (thumbnailUrl) {
      formData.append("thumbnail", thumbnail);
    }
    await axios
      .patch(`${base_url}/api/v1/videos/v/${video._id}`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("Update video", res.data);
        setIsLoading(false);
        toast("Video updated successfully!");
        refetch();
        navigate(-1); // Go back to previous page
      })
      .catch((err) => {
        // console.error("Update error:", err);
        setIsLoading(false);
        toast.error("Failed to update video");
      });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">✏️ Edit Video</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-[#2f2f2f] p-6 rounded-xl shadow-md"
      >
        {/* Title */}
        <div>
          <label className="block mb-2 font-medium text-gray-300">Title:</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cf0a17]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-300">
            Description:
          </label>
          <textarea
            className="w-full p-2 h-28 resize-none rounded-md bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cf0a17]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
          />
        </div>

        {/* Thumbnail Upload */}
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
            isDragging ? "border-green-500 bg-[#1f1f1f]" : "border-gray-600"
          }`}
        >
          <label
            htmlFor="thumbnail"
            className="cursor-pointer inline-flex items-center text-[#cf0a17] font-medium hover:underline"
          >
            <i className="fa-solid fa-image mr-2"></i>
            Upload Thumbnail
          </label>

          <input
            onChange={thumbnailFileHandler}
            type="file"
            id="thumbnail"
            accept="image/*"
            className="hidden"
          />

          <p className="text-xs text-gray-400 mt-2">
            Drag and drop or click to upload an image
          </p>

          {(thumbnail || thumbnailUrl) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {!thumbnailUrl && thumbnail && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Current Thumbnail
                  </p>
                  <img
                    src={thumbnail}
                    alt="Old Thumbnail"
                    className="h-24 w-40 mx-auto object-cover rounded-md border border-gray-500"
                  />
                </div>
              )}
              {thumbnailUrl && (
                <div className="text-center">
                  <p className="text-sm text-green-400 mb-2">New Thumbnail</p>
                  <img
                    src={thumbnailUrl}
                    alt="New Thumbnail"
                    className="h-24 w-40 mx-auto object-cover rounded-md border border-green-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#cf0a17] hover:bg-[#e02028] px-6 py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading && (
              <i className="fa-solid fa-spinner fa-spin-pulse text-sm"></i>
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserVideo;
