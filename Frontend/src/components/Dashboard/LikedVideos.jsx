import React,{useState, useEffect} from 'react'
import axios from 'axios';

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);

  const fetchLikedVideos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/likes/liked-videos",{
        headers: {
          Authorization: "Bearer "+ localStorage.getItem("token")
        }
      })
      console.log("Likes", res.data)
      setLikedVideos(res.data.data.likedVideos);
    } catch (error) {
      console.error("liked video error", error)
    }
  };


  useEffect(() => {
    fetchLikedVideos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Liked Videos</h1>

      {likedVideos.length === 0 ? (
        <p className="text-gray-500">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likedVideos.map(({ video, likedAt }) => (
            <div
              key={video._id}
              className="flex flex-col md:flex-row gap-3 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full md:w-60 h-36 object-cover"
              />

              <div className="flex-1 p-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {video.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-white">
                  {video.owner?.fullName || video.owner?.username}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Liked on {new Date(likedAt).toLocaleDateString()}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default LikedVideos