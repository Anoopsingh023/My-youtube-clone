// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   Link,
//   Links,
//   Outlet,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import Navbar from "../Navbar";
// import { VideoContext } from "../context/VideoContext";
// import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
// import useRandomVideo from "../hooks/useRandomVideo";
// import Sidebar from "./Sidebar";
// import useSubscription from "../hooks/useSubscription";
// import useUserPlaylist from "../hooks/useUserPlaylist";
// import useUserVideos from "../hooks/useUserVideos";
// import { base_url } from "../../utils/constant";

// const Dashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("userId")
//   const { videos, loading, error } = useRandomVideo();
//   const { userVideo } = useUserVideos(userId);
//   // const {subscribedChannels} = useSubscription()
//   // console.log("subscribed channel on dashboard", subscribedChannels)
//   const { playlists } = useUserPlaylist(userId);
//   // console.log("Playlist on profile", playlists)

//   const [searchQuery, setSearchQuery] = useState("");

//   // const [subscribedChannels, setSubscribedChannel] = useState([]);
//   const [logedin, setLogedin] = useState(false);
//   const [isSidebarVisible, setSidebarVisible] = useState(true);

//   const toggleSidebar1 = () => {
//     setSidebarVisible(!isSidebarVisible);
//   };

//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarCollapsed((prev) => !prev);
//   };

//   // useEffect(() => {
//   //   getSubscribedChannel();
//   //   if (localStorage.getItem("token")) {
//   //     setLogedin(true);
//   //   }
//   // }, []);

//   const getSubscribedChannel = () => {
//     axios
//       .get(
//         `${base_url}/api/v1/subscriptions/u/${localStorage.getItem("userId")}`,
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       )
//       .then((res) => {
//         console.log("subscribed channels by user", res.data);
//         const userData = res.data?.data?.[0]; // null-safe access
//         const channels = userData?.subscribedChannel || []; // fallback to empty array
//         setSubscribedChannel(channels);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const { filteredVideos, handleSort, sortKey, sortOrder } =
//     useFilteredSortedVideos(videos, searchQuery);

//   return (
//     <VideoContext.Provider value={{ filteredVideos, playlists, userVideo }}>
//       <div className="flex flex-col h-screen">
//         {/* Navbar */}
//         <div className="bg-black shadow-2xl">
//           <Navbar onSearch={setSearchQuery} onToggleSidebar={toggleSidebar} />
//         </div>

//         {/* Sidebar + Content */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar */}

//           <div
//             className={`${
//               isSidebarCollapsed ? "w-20" : "w-64"
//             } bg-black overflow-y-auto scrollbar-hover pb-40 text-[#ece9e9]  `}
//           >
//             <Sidebar isCollapsed={isSidebarCollapsed} />
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 bg-black overflow-y-auto scrollbar-hover text-white">
//             {loading ? (
//               <div className="p-4 text-white text-center">
//                 Loading videos...
//               </div>
//             ) : error ? (
//               <div className="p-4 text-red-400 text-center">
//                 Error loading videos.
//               </div>
//             ) : (
//               <Outlet />
//             )}
//           </div>
//         </div>
//       </div>
//     </VideoContext.Provider>
//   );
// };

// export default Dashboard;


import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import { VideoContext } from "../context/VideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useRandomVideo from "../hooks/useRandomVideo";
import useUserPlaylist from "../hooks/useUserPlaylist";
import useUserVideos from "../hooks/useUserVideos";
import { base_url } from "../../utils/constant";
import useHistory from "../hooks/useHistory";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { videos, loading, error } = useRandomVideo();
  const { userVideo } = useUserVideos(userId);
  const { playlists } = useUserPlaylist(userId);
  const {history, addToWatchHistory, removevideo, clearHistory} = useHistory()

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const { filteredVideos, handleSort, sortKey, sortOrder } =
    useFilteredSortedVideos(videos, searchQuery);

  return (
    <VideoContext.Provider value={{ filteredVideos, playlists, userVideo, history, addToWatchHistory, removevideo, clearHistory }}>
      <div className="flex flex-col h-screen bg-black text-white">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-black shadow-lg">
          <Navbar onSearch={setSearchQuery} onToggleSidebar={toggleSidebar} />
        </header>

        {/* Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`${
              isSidebarCollapsed ? "w-16" : "w-64"
            } transition-all duration-300 bg-[#0f0f0f] hidden sm:block overflow-y-auto scrollbar-hover`}
          >
            <Sidebar isCollapsed={isSidebarCollapsed} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto scrollbar-hover p-3 bg-[#0f0f0f]">
            {loading ? (
              <div className="text-center mt-10">Loading videos...</div>
            ) : error ? (
              <div className="text-center text-red-500 mt-10">
                Error loading videos.
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </VideoContext.Provider>
  );
};

export default Dashboard;

