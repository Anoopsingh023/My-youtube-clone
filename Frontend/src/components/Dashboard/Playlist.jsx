// import React from "react";
// import { useParams, useLocation } from "react-router-dom";
// import moment from "moment";

// const Playlist = () => {
//   const { playlistId } = useParams();
//   const { state } = useLocation();
//   const playlist = state?.playlist;
//   console.log("Playlist on playlist", playlist)

//   if (!playlist) return <p className="text-white text-center mt-10">Playlist not found</p>;

//   return (
//     <div className="flex flex-col min-h-screen  text-white px-4 py-6">
//       <div className="flex flex-col md:flex-row md:items-start gap-6">
//         {/* Playlist Details */}
//         <div className="md:w-1/3 bg-[#644e3e] p-5 rounded-xl">
//           <img
//             src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
//             alt="playlist-thumbnail"
//             className="rounded-xl w-full aspect-video object-cover mb-4"
//           />
//           <h1 className="text-xl font-bold mb-2">{playlist.name}</h1>
//           <p className="text-gray-400 text-sm mb-2">
//             {playlist.videos.length} videos • Created {moment(playlist.createdAt).fromNow()}
//           </p>
//           <p className="text-sm text-gray-300 mb-4">{playlist.description || "No description provided."}</p>
//           <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold">
//             Play All
//           </button>
//         </div>

//         {/* Video List */}
//         <div className="flex-1 space-y-4">
//           {playlist.videos.map((video, index) => (
//             <div
//               key={video._id}
//               className="flex flex-col sm:flex-row gap-3 items-start sm:items-center pb-4"
//             >
//               <img
//                 src={video.thumbnail}
//                 alt="video-thumb"
//                 className="w-full sm:w-48 rounded-lg aspect-video object-cover"
//               />
//               <div className="flex flex-col flex-1">
//                 <h2 className="text-base font-medium mb-1 line-clamp-2">{video.title}</h2>
//                 {/* <p className="text-sm text-gray-400">
//                   {video.owner.fullName} • {video.views} views • {moment(video.createdAt).fromNow()}
//                 </p> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Playlist;

import React,{useEffect} from "react";
import { useParams, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { base_url } from "../../utils/constant";

const Playlist = () => {
  const { playlistId } = useParams();
  const { state } = useLocation();
  const playlist = state?.playlist;
  // const user = state?.user
  console.log("Playlist on playlist", playlist);
  // console.log("user on playlist", user)

  useEffect(() => {
      fetchUserProfile();
    }, []);

  const fetchUserProfile = () => {
    axios.get(`${base_url}/api/v1/users/u/${playlist.owner}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    .then((res)=>{
      console.log("User on playlist", res.data)
    })
    .catch((err)=>{
      console.error("Error user on playlist",err)
    })
  };

  if (!playlist)
    return <p className="text-white text-center mt-10">Playlist not found</p>;

  return (
    <div className="flex  text-white h-screen overflow-hidden gap-2">
      {/* Fixed Left Sidebar */}
      <div className="hidden bg-[#644e3e] md:flex md:flex-col md:w-1/3 lg:w-1/4 px-4 py-6 border-r border-gray-800 fixed h-full rounded-xl">
        <img
          src={playlist.thumbnail || playlist.videos?.[0]?.thumbnail}
          alt="playlist-thumbnail"
          className="rounded-xl w-full aspect-video object-cover mb-4"
        />
        <h1 className="text-xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-gray-400 text-sm mb-2">
          {playlist.videos.length} videos • Created{" "}
          {moment(playlist.createdAt).fromNow()}
        </p>
        <p className="text-sm text-gray-300 mb-4">
          {playlist.description || "No description provided."}
        </p>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold">
          Play All
        </button>
      </div>

      {/* Scrollable Right Content */}
      <div className="flex-1 md:ml-[43.33%] lg:ml-[31%] px-4 py-6 overflow-y-auto h-full space-y-6">
        {playlist.videos.map((video, index) => (
          <div
            key={video._id}
            className="flex flex-col sm:flex-row gap-3 items-start sm:items-center border-b border-gray-700 pb-4"
          >
            <img
              src={video.thumbnail}
              alt="video-thumb"
              className="w-full sm:w-48 rounded-lg aspect-video object-cover"
            />
            <div className="flex flex-col flex-1">
              <h2 className="text-base font-medium mb-1 line-clamp-2">
                {video.title}
              </h2>
              {/* <p className="text-sm text-gray-400">
                {video.owner.fullName} • {video.views} views • {moment(video.createdAt).fromNow()}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
