import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSubscription } from "../context/VideoContext";
// import useSubscription from "../hooks/useSubscription";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const { subscribedChannels } = useSubscription();
  const [isLogged, setIsLogged] = useState(false);

  const navLinks0 = [
    { to: "/dashboard/home", icon: "fa-house", label: "Home" },
    { to: "/dashboard/short-page", icon: "fa-bolt", label: "Shorts" },
    { to: "/dashboard/subscription", icon: "fa-tv", label: "Subscriptions" },
  ];

  const navLinks1 = [
    {
      to: "/dashboard/history",
      icon: "fa-clock-rotate-left",
      label: "History",
    },
    { to: "/dashboard/saved-playlist", icon: "fa-list", label: "Playlist" },
    { to: `/channel/${username}`, icon: "fa-video", label: "Your Video" },
    { to: "/dashboard/watch-later", icon: "fa-clock", label: "Watch Later" },
    {
      to: "/dashboard/liked-videos",
      icon: "fa-thumbs-up",
      label: "Liked Videos",
    },
  ];

  const navLinks2 = [
    { to: "/dashboard/home", icon: "fa-house", label: "Home" },
    { to: "/dashboard/short-page", icon: "fa-bolt", label: "Shorts" },
    { to: "/dashboard/subscription", icon: "fa-tv", label: "Subscriptions" },
    {
      to: "/dashboard/feed/you",
      icon: "fa-user",
      label: "You",
    },
    {
      to: "/dashboard/history",
      icon: "fa-clock-rotate-left",
      label: "History",
    },
  ];

  const handleChannelClick = (channel) => {
    navigate(`/dashboard/${channel.username}`);
  };
  const handleLogClick = ()=>{
    navigate(`/login`)
  }

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("token"));
  }, []);

  const renderLinks = (links) =>
    links.map(({ to, icon, label }) => (
      <Link
        key={label}
        to={to}
        className={`${
          location.pathname === to ? "bg-[#3b3b3b]" : "hover:bg-[#3b3b3b]"
        } flex items-center gap-3 py-2 px-4 rounded-xl`}
      >
        <i className={`fa-solid ${icon} ${isCollapsed ? "mx-auto" : ""}`}></i>
        {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      </Link>
    ));

  return (
    <div
      className={`
        ${isCollapsed ? "w-0 sm:w-[70px]" : "w-[240px]"} 
        bg-[#0f0f0f] text-[#e3dede] h-screen transition-all 
        fixed sm:relative z-50 overflow-hidden
      `}
    >
      <div className="pt-6 px-2 font-medium flex flex-col gap-1">
        {isLogged ? renderLinks(navLinks0) : renderLinks(navLinks2)}
        {!isCollapsed && <hr className="mx-5 my-2 text-[#3b3b3b]" />}
        {isCollapsed ? (
          <Link
            to="/dashboard/feed/you"
            className={`${
              location.pathname === "/dashboard/feed/you"
                ? "bg-[#3b3b3b]"
                : "hover:bg-[#3b3b3b]"
            } ${
              isLogged ? "flex" : "hidden"
            } flex items-center gap-3 py-2 px-4 rounded-xl `}
          >
            {" "}
            <i class="fa-regular fa-user"></i>
          </Link>
        ) : (
          <Link
            to="/dashboard/feed/you"
            className={`${
              location.pathname === "/dashboard/feed/you"
                ? "bg-[#3b3b3b]"
                : "hover:bg-[#3b3b3b]"
            } ${
              isLogged ? "flex" : "hidden"
            } flex items-center gap-3 py-2 px-4 rounded-xl `}
          >
            You <i className="fa-solid fa-greater-than font-light"></i>
          </Link>
        )}
        {isLogged && !isCollapsed && renderLinks(navLinks1)}
      </div>

      {isLogged && !isCollapsed && (
        <>
          <hr className="m-5 text-[#3b3b3b]" />
          <h2 className="px-6 font-medium">Subscriptions</h2>
          <div className="pt-2 px-2 font-medium flex flex-col gap-1">
            {subscribedChannels.map((subscribedChannel) => (
              <div
                key={subscribedChannel._id}
                onClick={() => handleChannelClick(subscribedChannel.channel)}
                className="flex items-center hover:bg-[#3b3b3b] w-[90%] py-2 px-4 rounded-xl cursor-pointer"
              >
                <img
                  className="h-6 w-6 object-cover rounded-xl mr-3"
                  src={subscribedChannel.channel.avatar}
                  alt="avatar"
                />
                <h2 className="text-sm">
                  {subscribedChannel.channel.fullName}
                </h2>
              </div>
            ))}
          </div>
        </>
      )}
      {!isCollapsed && !isLogged && (
        <div className="flex flex-col  items-center gap-4">
          <p className="px-7">
            Sign in to like videos, comment and subscribe.
          </p>
          <button
            onClick={handleLogClick}
            className="border bg-[#232323] py-2 px-4 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
          >
            <i class="fa-regular fa-user"></i> Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
