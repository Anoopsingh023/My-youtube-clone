import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";
import { toast } from "react-toastify";

const useSave = (videoId) => {
  const [isSaved, setIsSaved] = useState(false);

  const saveVideo = () => {
    axios
      .post(
        `${base_url}/api/v1/videos/save/${videoId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // console.log("Saved in watch later", res.data);
        isVideoInWatchLater();
        // setUser(res.data.data)
      })
      .catch((err) => {
        toast.error("Login Required")
        // console.error("Error Saving watch later", err);
      });
  };

  const isVideoInWatchLater = () => {
    axios
      .get(`${base_url}/api/v1/videos/save/${videoId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log("is Already in watch later", res.data);
        // setUser(res.data.data)
        setIsSaved(res.data.data.isAdded);
      })
      .catch((err) => {
        // console.error("Error is already in  watch later", err);
      });
  };

  useEffect(() => {
    isVideoInWatchLater();
  },[videoId]);
  return { isSaved, saveVideo: saveVideo };
};

export default useSave;
