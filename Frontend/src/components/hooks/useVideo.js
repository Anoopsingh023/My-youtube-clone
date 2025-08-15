import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { base_url } from '../../utils/constant';

const useVideo = ( videoId) => {

  const [videoById, setVideoById] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoById = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${base_url}/api/v1/videos/v/${videoId}`,
        {
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          // },
        }
      );
      const userData = res.data.data || [];
      console.log("video by videoId", res.data)
      setVideoById(userData || [])
    } catch (err) {
      console.error("video by id error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoById()
  }, [videoId]);

  return {videoById, loading, error }; 
}

export default useVideo