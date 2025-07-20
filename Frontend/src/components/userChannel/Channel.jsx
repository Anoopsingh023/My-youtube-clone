import React,{useState, useEffect, useMemo} from "react";
import Navbar from "../Navbar";
import { Link, Outlet,useLocation } from "react-router-dom";
import { VideoContext } from "../context/VideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useUserVideos from "../hooks/useUserVideos";
import useUserPlaylist from "../hooks/useUserPlaylist";
import useFilteredSortedPlaylist from "../hooks/useFilteredSortedPlaylist";

export const Channel = () => {

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const userId = localStorage.getItem("userId")
  const { videos, loading, error, refetch } = useUserVideos(userId);
  const {createPlaylist, playlists, refetchPlaylist} = useUserPlaylist(userId)


  const { filteredVideos, handleSort, sortKey, sortOrder } =
    useFilteredSortedVideos(videos, searchQuery);

  
  return (
    <VideoContext.Provider value={{ filteredVideos, handleSort, sortKey, sortOrder, refetch, createPlaylist, playlists, refetchPlaylist }}>
  <div className="flex flex-col h-screen text-white">
    
    {/* Navbar */}
    <div className="bg-[#393333] drop-shadow-md">
      <Navbar onSearch={setSearchQuery} />
    </div>

    {/* Main body: sidebar + outlet */}
    <div className="flex flex-1 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[16%] bg-[#393333] overflow-y-auto border-r border-[#484747] scrollbar-hover">
        <div className="flex flex-col items-center pt-6 px-2 text-[#ece9e9] font-medium">
          <img
            className="h-30 w-30 rounded-full"
            src={localStorage.getItem("avatar")}
            alt="avatar"
          />
          <h4>{localStorage.getItem("name")}</h4>
          <p>{localStorage.getItem("userName")}</p>

          <Link
            to={`/channel/${localStorage.getItem("userName")}/user-profile`}
            className={`${
              location.pathname === `/channel/${localStorage.getItem("userName")}/user-profile`
                ? "bg-[#272626]"
                : "hover:bg-[#272626]"
            } w-[90%] py-2 px-4 duration-300 rounded-xl`}
          >
            <i class="fa-solid fa-user"></i> Profile
          </Link>
          <Link
            to={`/channel/${localStorage.getItem("userName")}/user-videos`}
            className={`${
              location.pathname === `/channel/${localStorage.getItem("userName")}/user-videos`
                ? "bg-[#272626]"
                : "hover:bg-[#272626]"
            } w-[90%] py-2 px-4 duration-300 rounded-xl`}
          >
            <i class="fa-solid fa-video"></i> Video
          </Link>

          <Link
            to={`/channel/${localStorage.getItem("userName")}/user-playlist`}
            className={`${
              location.pathname === `/channel/${localStorage.getItem("userName")}/user-playlist`
                ? "bg-[#272626]"
                : "hover:bg-[#272626]"
            } w-[90%] py-2 px-4 duration-300 rounded-xl`}
          >
            <i class="fa-solid fa-bars"></i> Playlist
          </Link>

          <Link
            to={`/channel/${localStorage.getItem("userName")}/user-tweets`}
            className={`${
              location.pathname === `/channel/${localStorage.getItem("userName")}/user-tweets`
                ? "bg-[#272626]"
                : "hover:bg-[#272626]"
            } w-[90%] py-2 px-4 duration-300 rounded-xl`}
          >
            <i className="fa-solid fa-house mr-5"></i> Tweets
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-[84%] overflow-y-auto scrollbar-hover bg-[#393333]">
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
