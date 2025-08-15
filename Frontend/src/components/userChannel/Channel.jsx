import React, { useState } from "react";
import Navbar from "../Navbar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { VideoContext } from "../context/VideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useUserVideos from "../hooks/useUserVideos";
import useUserPlaylist from "../hooks/useUserPlaylist";

export const Channel = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userId = localStorage.getItem("userId");
  const { videos, loading, error, refetch } = useUserVideos(userId);
  const { createPlaylist, playlists, refetchPlaylist } = useUserPlaylist(userId);

  const { filteredVideos, handleSort, sortKey, sortOrder } =
    useFilteredSortedVideos(videos, searchQuery);

  const toggleSidebar = () => {
    // For desktop collapse, for mobile toggle open/close
    if (window.innerWidth >= 768) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        filteredVideos,
        handleSort,
        sortKey,
        sortOrder,
        refetch,
        createPlaylist,
        playlists,
        refetchPlaylist,
      }}
    >
      <div className="flex flex-col h-screen text-white">
        {/* Navbar */}
        <div className="sticky top-0 z-50 bg-[#393333] ">
          <Navbar onSearch={setSearchQuery} onToggleSidebar={toggleSidebar} />
        </div>

        {/* Main body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`
              fixed md:static top-0 left-0 h-full md:h-auto z-50
              bg-[#393333] border-r border-[#484747] overflow-y-auto scrollbar-hover
              transition-transform duration-300 
              ${sidebarOpen ? "translate-x-0 bg-[#393333e3]" : "-translate-x-full"} 
              ${isSidebarCollapsed ? "w-20" : "w-64"} 
              md:translate-x-0
            `}
          >
            <div className="flex flex-col items-center pt-6 px-2 text-[#ece9e9] font-medium ">
              <img
                className={`${isSidebarCollapsed?"h-10 w-10":"h-30 w-30"} rounded-full object-cover mb-2`}
                src={localStorage.getItem("avatar")}
                alt="avatar"
              />
              {!isSidebarCollapsed && (
                <>
                  <h4>{localStorage.getItem("name")}</h4>
                  <p className="mb-5">{localStorage.getItem("userName")}</p>
                </>
              )}

              {[
                { to: "user-profile", icon: "fa-user", label: "Profile" },
                { to: "user-videos", icon: "fa-video", label: "Video" },
                { to: "user-playlist", icon: "fa-bars", label: "Playlist" },
                { to: "user-tweets", icon: "fa-house", label: "Tweets" },
              ].map((item) => {
                const fullPath = `/channel/${localStorage.getItem(
                  "userName"
                )}/${item.to}`;
                return (
                  <Link
                    key={item.to}
                    to={fullPath}
                    className={`flex items-center gap-2 w-[90%] py-2 px-4 duration-300 rounded-xl
                      ${
                        location.pathname === fullPath
                          ? "bg-[#272626]"
                          : "hover:bg-[#272626]"
                      }
                    `}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                    {!isSidebarCollapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0  bg-opacity-2 md:hidden z-40"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hover bg-[#393333]">
            {loading ? (
              <div className="p-4 flex justify-center">Loading ...</div>
            ) : error ? (
              <div className="p-4 text-red-400">Error loading.</div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </VideoContext.Provider>
  );
};
