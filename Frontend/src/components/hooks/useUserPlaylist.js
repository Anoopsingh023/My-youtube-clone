import React, { useState, useEffect } from "react";
import axios from "axios";

const useUserPlaylist = (userId) => {
  const [playlists, setPlaylists] = useState([]);

  const fetchAllPlaylist = () => {
    axios
      .get(`http://localhost:8000/api/v1/playlists/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("User Playlist by userId", res.data.data);
        const userPlaylist = res.data || [];
        setPlaylists(userPlaylist.data);
      })
      .catch((err) => {
        console.error("User Playlist by userId error ", err);
      });
  };

  const handleCreateplaylist = (name, description) => {
    axios
      .post(
        `http://localhost:8000/api/v1/playlists/create`,
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
        console.log("Playlist created", res.data);
        fetchAllPlaylist();
      })
      .catch((err) => {
        console.error("Error create playlist", err);
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
