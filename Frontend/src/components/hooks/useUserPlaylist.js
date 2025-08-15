import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";
import { toast } from "react-toastify";

const useUserPlaylist = (userId) => {
  const [playlists, setPlaylists] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAllPlaylist = async () => {
  let data;
  try {
    const res = await axios.get(
      `${base_url}/api/v1/playlists/user/${userId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    data = res.data;
    setPlaylists(data?.data || []);
  } catch (err) {
    // toast("Something went wrong while loading playlist");
  }
};


  const handleCreateplaylist = (name, description) => {
    axios
      .post(
        `${base_url}/api/v1/playlists/create`,
        {
          name: name,
          description: description,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Playlist created", res.data);
        fetchAllPlaylist();
        toast("Playlist created successfully")
      })
      .catch((err) => {
        // console.error("Error create playlist", err);
        toast.error("failed to create playlist")
      });
  };

  useEffect(() => {
    fetchAllPlaylist();
  }, [userId]);

  return {
    createPlaylist: handleCreateplaylist,
    playlists,
    refetchPlaylist: fetchAllPlaylist,
  };
};

export default useUserPlaylist;
