import axios from "axios";
import React, { useState, useEffect } from "react";
import useUserPlaylist from "../hooks/useUserPlaylist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../utils/constant";
import upload2 from "../../assets/upload2.svg";

const UserPlaylist = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { createPlaylist, playlists, refetchPlaylist } =
    useUserPlaylist(userId);

  const [openPlaylistId, setOpenPlaylistId] = useState(null);
  const [open, setopen] = useState(false);
  const [editData, setEditData] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenPlaylistId(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleUpdate = (playlistId) => {
    const data = editData[playlistId];
    axios
      .patch(`${base_url}/api/v1/playlists/user/p/${playlistId}`, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Updated Playlist", res.data);
        refetchPlaylist();
        toast("Playlist Updated Successfully");
      })
      .catch((err) => {
        console.error("Update playlist error", err);
        toast.error("playlist update failed");
      });
  };

  const handleDelete = (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?"))
      return;

    axios
      .delete(`${base_url}/api/v1/playlists/user/p/${playlistId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast("Playlist deleted successfully");
        refetchPlaylist();
      })
      .catch(() => {
        toast.error("Failed to delete the playlist.");
      });
  };

  const handlePlaylist = (playlist) => {
    navigate(`/channel/${localStorage.getItem("userName")}/${playlist._id}`, {
      state: { playlist },
    });
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Create Playlist Button */}
      <div className="flex justify-center items-center mb-6">
        <div>
          <img
            onClick={() => setopen(true)}
            className="h-28 w-28 sm:h-40 sm:w-40 cursor-pointer"
            src={upload2}
            alt=""
          />
          <div className="mt-2 flex justify-center text-lg sm:text-2xl px-4 py-2 cursor-pointer hover:bg-[#272626] duration-300 rounded-xl">
            <button onClick={() => setopen(true)}>Create Playlist</button>
          </div>
        </div>
      </div>

      {/* Create Playlist Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm modal-overlay">
          <div className="bg-[#1e1e1e] w-[90%] sm:w-1/2 max-w-2xl rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-700 relative">
            <button
              onClick={() => setopen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Create Playlist
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPlaylist(name, description);
                setopen(false);
              }}
              className="flex flex-col gap-4"
            >
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full px-4 py-2 rounded-md text-white text-sm"
                placeholder="Playlist name"
              />
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-white text-sm"
                placeholder="Description"
              />
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setopen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table on Desktop / Cards on Mobile */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="min-w-full border-collapse shadow-md rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Playlist</th>
              <th className="p-4">Title</th>
              <th className="p-4">Date</th>
              <th className="p-4">Views</th>
              <th className="p-4">Total Video</th>
              <th className="p-4">Update</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {playlists.map((playlist) => (
              <tr key={playlist._id} className="border-b">
                <td onClick={() => handlePlaylist(playlist)} className="p-4">
                  {playlist.videos.length > 0 ? (
                    <img
                      src={playlist.videos[0].thumbnail}
                      alt="thumbnail"
                      className="w-32 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No video</span>
                  )}
                </td>
                <td onClick={() => handlePlaylist(playlist)} className="p-4">
                  {playlist.name}
                </td>
                <td className="p-4">
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {playlist.videos.reduce(
                    (total, video) => total + (video.views || 0),
                    0
                  )}
                </td>
                <td className="p-4">{playlist.videos.length}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenPlaylistId(
                            openPlaylistId === playlist._id
                              ? null
                              : playlist._id
                          )
                        }
                        className="px-4 py-2 border rounded hover:bg-[#272626] cursor-pointer"
                      >
                        Update
                      </button>
                      {openPlaylistId === playlist._id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm"
                          onClick={(e) => {
                            // Close when clicking outside the modal box
                            if (e.target.classList.contains("modal-overlay")) {
                              setOpenPlaylistId(null);
                              setEditData((prev) => {
                                const newData = { ...prev };
                                delete newData[playlist._id];
                                return newData;
                              });
                            }
                          }}
                        >
                          <div className="modal-overlay flex items-center justify-center w-full h-full">
                            <div className="animate-fade-in bg-[#1e1e1e] w-1/2 max-w-2xl rounded-2xl shadow-lg p-6 border border-gray-700 relative">
                              {/* Close icon */}
                              <button
                                onClick={() => {
                                  setOpenPlaylistId(null);
                                  setEditData((prev) => {
                                    const newData = { ...prev };
                                    delete newData[playlist._id];
                                    return newData;
                                  });
                                }}
                                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
                              >
                                &times;
                              </button>

                              <h2 className="text-xl font-semibold text-white mb-4">
                                Update Playlist
                              </h2>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleUpdate(playlist._id);
                                  setOpenPlaylistId(null);
                                }}
                                className="flex flex-col gap-4"
                              >
                                <div>
                                  <label className="block text-md text-gray-300 mb-1">
                                    Playlist Name
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      editData[playlist._id]?.name ??
                                      playlist.name
                                    }
                                    onChange={(e) => {
                                      const prevData = editData[
                                        playlist._id
                                      ] || {
                                        name: playlist.name,
                                        description: playlist.description,
                                      };
                                      setEditData((prev) => ({
                                        ...prev,
                                        [playlist._id]: {
                                          ...prevData,
                                          name: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="w-full px-4 py-2 rounded-md text-white text-sm"
                                    placeholder="Enter playlist name"
                                  />
                                </div>

                                <div>
                                  <label className="block text-md text-gray-300 mb-1">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      editData[playlist._id]?.description ??
                                      playlist.description
                                    }
                                    onChange={(e) => {
                                      const prevData = editData[
                                        playlist._id
                                      ] || {
                                        name: playlist.name,
                                        description: playlist.description,
                                      };
                                      setEditData((prev) => ({
                                        ...prev,
                                        [playlist._id]: {
                                          ...prevData,
                                          description: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="w-full px-4 py-2 rounded-md text-white text-sm"
                                    placeholder="Enter description"
                                  />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                  <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenPlaylistId(null);
                                      setEditData((prev) => {
                                        const newData = { ...prev };
                                        delete newData[playlist._id];
                                        return newData;
                                      });
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(playlist._id)}
                    className="px-3 py-2 border rounded hover:bg-[#272626]"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-[#1e1e1e] p-4 rounded-lg shadow-md"
          >
            <div
              onClick={() => handlePlaylist(playlist)}
              className="cursor-pointer"
            >
              {playlist.videos.length > 0 ? (
                <img
                  src={playlist.videos[0].thumbnail}
                  alt="thumbnail"
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400 italic">No video</span>
              )}
            </div>
            <h3 className="text-white mt-2">{playlist.name}</h3>
            <p className="text-sm text-gray-400">
              {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Views: {playlist.videos.reduce((t, v) => t + (v.views || 0), 0)}
            </p>
            <p className="text-sm">Videos: {playlist.videos.length}</p>
            <div className="flex gap-3 mt-3">
              <div className="flex flex-col">
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenPlaylistId(
                        openPlaylistId === playlist._id ? null : playlist._id
                      )
                    }
                    className="px-15 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Update
                  </button>
                  {openPlaylistId === playlist._id && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm"
                      onClick={(e) => {
                        // Close when clicking outside the modal box
                        if (e.target.classList.contains("modal-overlay")) {
                          setOpenPlaylistId(null);
                          setEditData((prev) => {
                            const newData = { ...prev };
                            delete newData[playlist._id];
                            return newData;
                          });
                        }
                      }}
                    >
                      <div className="modal-overlay flex items-center justify-center w-full h-full">
                        <div className="animate-fade-in bg-[#1e1e1e] w-1/2 max-w-2xl rounded-2xl shadow-lg p-6 border border-gray-700 relative">
                          {/* Close icon */}
                          <button
                            onClick={() => {
                              setOpenPlaylistId(null);
                              setEditData((prev) => {
                                const newData = { ...prev };
                                delete newData[playlist._id];
                                return newData;
                              });
                            }}
                            className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
                          >
                            &times;
                          </button>

                          <h2 className="text-xl font-semibold text-white mb-4">
                            Update Playlist
                          </h2>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdate(playlist._id);
                              setOpenPlaylistId(null);
                            }}
                            className="flex flex-col gap-4"
                          >
                            <div>
                              <label className="block text-md text-gray-300 mb-1">
                                Playlist Name
                              </label>
                              <input
                                type="text"
                                value={
                                  editData[playlist._id]?.name ?? playlist.name
                                }
                                onChange={(e) => {
                                  const prevData = editData[playlist._id] || {
                                    name: playlist.name,
                                    description: playlist.description,
                                  };
                                  setEditData((prev) => ({
                                    ...prev,
                                    [playlist._id]: {
                                      ...prevData,
                                      name: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full px-4 py-2 rounded-md text-white text-sm"
                                placeholder="Enter playlist name"
                              />
                            </div>

                            <div>
                              <label className="block text-md text-gray-300 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={
                                  editData[playlist._id]?.description ??
                                  playlist.description
                                }
                                onChange={(e) => {
                                  const prevData = editData[playlist._id] || {
                                    name: playlist.name,
                                    description: playlist.description,
                                  };
                                  setEditData((prev) => ({
                                    ...prev,
                                    [playlist._id]: {
                                      ...prevData,
                                      description: e.target.value,
                                    },
                                  }));
                                }}
                                className="w-full px-4 py-2 rounded-md text-white text-sm"
                                placeholder="Enter description"
                              />
                            </div>

                            <div className="flex justify-end gap-4 mt-4">
                              <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenPlaylistId(null);
                                  setEditData((prev) => {
                                    const newData = { ...prev };
                                    delete newData[playlist._id];
                                    return newData;
                                  });
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(playlist._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPlaylist;
