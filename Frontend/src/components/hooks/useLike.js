import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";
import { toast } from "react-toastify";

const useLike = (videoId) => {
  const [likes, setLikes] = useState("");
  const [isLikedByUser, setIsLikedByUser] = useState("");

  const getTotalLikes = () => {
    axios
      .get(`${base_url}/api/v1/likes/v/${videoId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("Get total Likes ", res.data);
        setLikes(res.data.data[0].likesCount);
      })
      .catch((err) => {
        // console.log("get Total Likes Error", err);
      });
  };

  const toggleLikes = () => {
    axios
      .post(
        `${base_url}/api/v1/likes/toggle/v/${videoId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("toggleLikes", res.data);
        getTotalLikes();
        isVideoLiked();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Please Login");
      });
  };

  const isVideoLiked = () => {
    axios
      .get(`${base_url}/api/v1/likes/toggle/v/${videoId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("isLiked", res.data);
        setIsLikedByUser(res.data.data.isLiked);
      })
      .catch((err) => {
        // console.log("isLikedError", err);
      });
  };
  useEffect(() => {
    getTotalLikes(), isVideoLiked();
  }, []);
  return { likes, isLikedByUser, toggleLikes: toggleLikes };
};

export default useLike;
