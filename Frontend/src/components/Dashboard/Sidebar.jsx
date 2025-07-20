import React from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useSubscription } from "../context/VideoContext";
import useSubscription from "../hooks/useSubscription";

const Sidebar = ({ isCollapsed }) => {
  const userId = localStorage.getItem("userId")
  // const { subscribedChannels } = useSubscription(userId);

  const navigate = useNavigate();

  const handleChannelClick = (channel) => {
    navigate(`/dashboard/${channel.username}`);
  };

  return (
    <>
      {isCollapsed ? (
        <div className="flex flex-col items-center pt-6 px-1 ">
          {/* Nav Links */}
          {[
            {
              to: "/dashboard/home",
              icon: "fa-house",
              label: "Home",
            },
            {
              to: "/dashboard/short",
              icon: "fa-bolt",
              label: "Shorts",
            },
            {
              to: "/dashboard/Subscriptions",
              icon: "fa-tv",
              label: "Subscriptions",
            },
            {
              to: "/dashboard/Subscriptions",
              icon: "fa-user",
              label: "You",
            },
            // <i class="fa-regular fa-user"></i>
          ].map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              className={`${
                location.pathname === to ? "bg-[#3b3b3b]" : "hover:bg-[#3b3b3b]"
              } w-full  py-4   duration-300 rounded-xl flex flex-col items-center gap-1`}
            >
              <i className={`fa-solid ${icon} `}></i>

              <span className=" text-[10px]">{label}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center pt-6 px-2 font-medium ">
          {/* Nav Links */}
          {[
            {
              to: "/dashboard/home",
              icon: "fa-house",
              label: "Home",
            },
            {
              to: "/dashboard/short",
              icon: "fa-bolt",
              label: "Shorts",
            },
            {
              to: "/dashboard/Subscriptions",
              icon: "fa-tv",
              label: "Subscriptions",
            },
            {
              to: "/dashboard/history",
              icon: "fa-clock-rotate-left",
              label: "History",
            },
            {
              to: "/dashboard/playlist",
              icon: "fa-list",
              label: "Playlist",
            },
            {
              to: "/dashboard/my-video",
              icon: "fa-video",
              label: "Your Video",
            },
            {
              to: "/dashboard/your-course",
              icon: "fa-graduation-cap",
              label: "Your Courses",
            },
            {
              to: "/dashboard/watch-later",
              icon: "fa-clock",
              label: "Watch Later",
            },
            {
              to: "/dashboard/liked-video",
              icon: "fa-thumbs-up",
              label: "Liked Videos",
            },
            {
              to: "/dashboard/upload-video",
              icon: "fa-upload",
              label: "Upload",
            },
          ].map(({ to, icon, label }) => (
            <Link
              key={label}
              to={to}
              className={`${
                location.pathname === to ? "bg-[#3b3b3b]" : "hover:bg-[#3b3b3b]"
              } w-[90%] py-2 px-4 duration-300 rounded-xl`}
            >
              <i className={`fa-solid ${icon} mr-5`}></i>
              {!isCollapsed && (
                <span className="whitespace-nowrap">{label}</span>
              )}
            </Link>
          ))}

          <hr className="text-[#3b3b3b] w-full my-3" />
          <h2 className="mx-4 my-1">Subscriptions</h2>

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
        </div>
      )}
    </>
  );
};

export default Sidebar;
