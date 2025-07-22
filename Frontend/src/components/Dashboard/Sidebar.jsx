import React from "react";
import { useLocation, Link } from "react-router-dom";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const username = localStorage.getItem("username");

  const navLinks = [
    { to: "/dashboard/home", icon: "fa-house", label: "Home" },
    { to: "/dashboard/short-page", icon: "fa-bolt", label: "Shorts" },
    { to: "/dashboard/subscription", icon: "fa-tv", label: "Subscriptions" },
    { to: "/dashboard/history", icon: "fa-clock-rotate-left", label: "History" },
    { to: "/dashboard/saved-playlist", icon: "fa-list", label: "Playlist" },
    { to: `/channel/${username}`, icon: "fa-video", label: "Your Video" },
    { to: "/dashboard/courses", icon: "fa-graduation-cap", label: "Your Courses" },
    { to: "/dashboard/watch-later", icon: "fa-clock", label: "Watch Later" },
    { to: "/dashboard/liked-videos", icon: "fa-thumbs-up", label: "Liked Videos" },
  ];

  return (
    <div
      className={`
        ${isCollapsed ? "w-0 sm:w-[70px]" : "w-[240px]"} 
        bg-[#0f0f0f] text-white h-screen transition-all duration-300
        fixed sm:relative z-50 overflow-hidden
      `}
    >
      <div className="pt-6 px-2 font-medium flex flex-col gap-1">
        {navLinks.map(({ to, icon, label }) => (
          <Link
            key={label}
            to={to}
            className={`${
              location.pathname === to ? "bg-[#3b3b3b]" : "hover:bg-[#3b3b3b]"
            } flex items-center gap-3 py-2 px-4 rounded-xl duration-200`}
          >
            <i className={`fa-solid ${icon} ${isCollapsed ? "mx-auto" : ""}`}></i>
            {!isCollapsed && (
              <span className="whitespace-nowrap">{label}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;


{/* Subscribed Channels */}
{/* <div>
  {subscribedChannels.map((subscribedChannel) => (
    <div
      key={subscribedChannel._id}
      onClick={() => handleChannelClick(subscribedChannel.channel)}
      className="flex items-center hover:bg-[#3b3b3b] w-[90%] py-2 px-2 rounded-xl cursor-pointer"
    >
      <img
        className="h-7 w-7 object-cover rounded-xl mr-3"
        src={subscribedChannel.channel.avatar}
        alt="avatar"
      />
      <h2>{subscribedChannel.channel.fullName}</h2>
    </div>
  ))}
</div> */}