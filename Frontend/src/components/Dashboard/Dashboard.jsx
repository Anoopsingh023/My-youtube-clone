import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  Links,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "../Navbar";
import {  VideoContext } from "../context/VideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useRandomVideo from "../hooks/useRandomVideo";
import Sidebar from "./Sidebar";
import useSubscription from "../hooks/useSubscription";
import useUserPlaylist from "../hooks/useUserPlaylist";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videos, loading, error } = useRandomVideo();
  const {subscribedChannels} = useSubscription()
  const {playlists} = useUserPlaylist()
  // console.log("Playlist on profile", playlists)

  const [searchQuery, setSearchQuery] = useState("");

  // const [subscribedChannels, setSubscribedChannel] = useState([]);
  const [logedin, setLogedin] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar1 = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    getSubscribedChannel();
    if (localStorage.getItem("token")) {
      setLogedin(true);
    }
  }, []);

  const getSubscribedChannel = () => {
    axios
      .get(
        `http://localhost:8000/api/v1/subscriptions/u/${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("subscribed channels by user", res.data);
        const userData = res.data?.data?.[0]; // null-safe access
        const channels = userData?.subscribedChannel || []; // fallback to empty array
        setSubscribedChannel(channels);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    axios
      .post(
        `http://localhost:8000/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("logout", res.data);
        ["token", "userId", "userName", "avatar", "coverImage", "name"].forEach(
          (item) => localStorage.removeItem(item)
        );
        setLogedin(false);
        setSubscribedChannel([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  const { filteredVideos, handleSort, sortKey, sortOrder } =
    useFilteredSortedVideos(videos, searchQuery);

  return (
    <VideoContext.Provider value={{ filteredVideos, subscribedChannels, playlists }}>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="bg-black shadow-2xl">
          <Navbar onSearch={setSearchQuery} onToggleSidebar={toggleSidebar}/>
        </div>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}

          <div
          className={`${
            isSidebarCollapsed ? "w-20" : "w-64"
          } bg-black overflow-y-auto scrollbar-hover pb-40 text-[#ece9e9]  `}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </div>

          {/* Main Content */}
          <div className="flex-1 bg-black overflow-y-auto scrollbar-hover">
            {loading ? (
              <div className="p-4 text-white text-center">
                Loading videos...
              </div>
            ) : error ? (
              <div className="p-4 text-red-400 text-center">
                Error loading videos.
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </VideoContext.Provider>
  );
};

export default Dashboard;
