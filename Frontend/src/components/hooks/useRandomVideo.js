import { useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";

const useRandomVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${base_url}/api/v1/videos`,
        {
          headers: {
           
          },
        }
      );
      // console.log("Random Video", res.data)
      const userData = res.data.data || [];
      setVideos(userData.videos || []);
    } catch (err) {
      // console.error("User video error", err);
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

export default useRandomVideos;
