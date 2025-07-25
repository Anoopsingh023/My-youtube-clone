import React, { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";

const useHistory = () => {
  const [history, setHistory] = useState([]);

  const addToWatchHistory = async (videoId) => {
    try {
      const res = await axios.post(
        `${base_url}/api/v1/users/history/${videoId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Added to watch history:", res.data);
      fetchHistory();
    } catch (error) {
      console.error(
        "Error adding to history:",
        error.response?.data || error.message
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${base_url}/api/v1/users/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Watch history", res.data);
      setHistory(res.data.data.reverse()); // show latest first
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      //   setLoading(false);
    }
  };

  const removeFromHistory = async (videoId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this video from history?"
      )
    )
      return;
    try {
      await axios.delete(`${base_url}/api/v1/users/history/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHistory(history.filter((item) => item.video._id !== videoId));
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your history?")) return;
    try {
      await axios.delete(`${base_url}/api/v1/users/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    addToWatchHistory: addToWatchHistory,
    removevideo: removeFromHistory,
    clearHistory: clearHistory,
  };
};

export default useHistory;
