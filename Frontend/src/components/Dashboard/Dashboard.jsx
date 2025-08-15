import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import { VideoContext } from "../context/VideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useRandomVideo from "../hooks/useRandomVideo";
import useUserVideos from "../hooks/useUserVideos";
import useHistory from "../hooks/useHistory";
import useSubscription from "../hooks/useSubscription";
import { Home, CircleUser,Plus , Zap, TvMinimal } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const { videos, loading, error } = useRandomVideo();
  const { userVideo } = useUserVideos(userId);
  // const { playlists } = useUserPlaylist(userId);
  const {history, addToWatchHistory, removevideo, clearHistory} = useHistory()
  const {subscribedChannels} = useSubscription(userId)

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const { filteredVideos } =
    useFilteredSortedVideos(videos, searchQuery);

  return (
    <VideoContext.Provider value={{ filteredVideos, userVideo, history, addToWatchHistory, removevideo, clearHistory, subscribedChannels }}>
      <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f] shadow-lg">
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

        {/* Bottom Navigation for Mobile */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around items-center py-2 z-50">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center text-gray-300 hover:text-white"
          >
            <Home size={22} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/shorts")}
            className="flex flex-col items-center text-gray-300 hover:text-white"
          >
            <Zap size={22}/>
            <span className="text-xs">Shorts</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/upload-video")}
            className="flex flex-col items-center text-gray-300 hover:text-white"
          >
            <Plus className="bg-[#3f3e3e] p-1 rounded-full" size={32}/>
          </button>
          <button
            onClick={() => navigate("/dashboard/subscription")}
            className="flex flex-col items-center text-gray-300 hover:text-white"
          >
            <TvMinimal size={22} />
            <span className="text-xs">Subscription</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/feed/you")}
            className="flex flex-col items-center text-gray-300 hover:text-white"
          >
            <CircleUser size={22}/>
            <span className="text-xs">You</span>
          </button>
        </nav>
      </div>
    </VideoContext.Provider>
  );
};

export default Dashboard;

