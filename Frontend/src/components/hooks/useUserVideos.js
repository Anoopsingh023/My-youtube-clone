import { useState, useEffect } from "react";
import axios from "axios";

const useUserVideos = (userId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/u/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const userData = res.data.data[0] || [];
      console.log("User video by userId", res.data)
      setVideos(userData.video || []);
    } catch (err) {
      console.error("User video error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserVideos();
  }, []);

  return { videos, loading, error, refetch: fetchUserVideos };
};

export default useUserVideos;
