import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../utils/constant";

const SavedPlaylist = () => {
  const navigate = useNavigate();
  const [SavedPlaylists, setSavedplaylists] = useState([]);

  useEffect(() => {
    fetchSavedPlaylist();
  }, []);

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

  const handleClick = (playlist) => {
    navigate(`/dashboard/playlist/${playlist._id}`, { state: { playlist } });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Watch Later</h2>

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
                onClick={() => handleClick(playlist)}
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
    </div>
  );
};

export default SavedPlaylist;
