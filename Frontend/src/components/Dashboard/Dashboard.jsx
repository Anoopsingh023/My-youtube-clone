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
import { VideoContext } from "../context/UserVideoContext";
import useFilteredSortedVideos from "../hooks/useFilteredSortedVideos";
import useRandomVideo from "../hooks/useRandomVideo";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videos, loading, error } = useRandomVideo();
  const [searchQuery, setSearchQuery] = useState("");

  const [subscribedChannels, setSubscribedChannel] = useState([]);
  const [logedin, setLogedin] = useState(false);

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

  const handleChannelClick = (channel) => {
    navigate(`/dashboard/${channel.username}`);
  };

  const handleLogout = () => {
    logout();
  };

  const { filteredVideos, handleSort, sortKey, sortOrder } =
    useFilteredSortedVideos(videos, searchQuery);

  return (
    <VideoContext.Provider value={{filteredVideos}}>
      <div className="flex flex-col">
        <div className="bg-black shadow-2xl">
          <Navbar onSearch={setSearchQuery} />
        </div>
        <div className="flex ">
          <div className="w-[16%] bg-black h-lvh  overflow-y-auto  scrollbar-hover pb-40 ">
            <div className="flex flex-col justify-center  pt-6 px-2  text-[#ece9e9] font-medium">
              <Link
                to={"/dashboard/home"}
                className={`${
                  location.pathname === "/dashboard/home"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-house mr-5"></i> Home
              </Link>
              <Link
                to={"/dashboard/short"}
                className={`${
                  location.pathname === "/dashboard/short"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-bolt mr-5"></i> Shorts
              </Link>
              <Link
                to={"/dashboard/Subscriptions"}
                className={`${
                  location.pathname === "/dashboard/Subscriptions"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-tv mr-5"></i> Subscriptions
              </Link>

              <hr className="text-[#3b3b3b] w-[100%] m-3" />

              <Link
                to={"/dashboard/Subscriptions"}
                className={`${
                  location.pathname === "/dashboard/Subscriptions"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                You<i class="fa-solid fa-angle-right ml-4"></i>
              </Link>

              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-clock-rotate-left mr-5"></i> History
              </Link>
              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-list mr-5"></i> Playlist
              </Link>

              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-video mr-5"></i> your Video
              </Link>

              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-graduation-cap mr-5"></i> your Cources
              </Link>

              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-regular fa-clock mr-5"></i> Watch Later
              </Link>

              <Link
                to={"/dashboard/my-video"}
                className={`${
                  location.pathname === "/dashboard/my-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-regular fa-thumbs-up mr-5"></i> Liked Videos
              </Link>

              <Link
                to={"/dashboard/upload-video"}
                className={`${
                  location.pathname === "/dashboard/upload-video"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-upload mr-5"></i> Upload
              </Link>

              <Link
                // to={"/dashboard/logout"}
                onClick={handleLogout}
                className={`${
                  location.pathname === "/dashboard/logout"
                    ? "bg-[#3b3b3b] "
                    : "hover:bg-[#3b3b3b]"
                } w-[90%] py-2 px-4 duration-300 rounded-xl`}
              >
                <i class="fa-solid fa-right-from-bracket mr-5"></i> Logout
              </Link>

              <hr className="text-[#3b3b3b] w-[100%] m-3" />
              <h2 className="mx-4 my-1">Subscriptions</h2>

              <div>
                {subscribedChannels.map((subscribedChannel) => (
                  <div
                    onClick={() => {
                      handleChannelClick(subscribedChannel.channel);
                    }}
                    className="flex flex-row items-center hover:bg-[#3b3b3b] w-[90%] py-2 duration-300 rounded-xl cursor-pointer"
                    key={subscribedChannel._id}
                  >
                    <img
                      onClick={() => {
                        handleChannelClick(subscribedChannel.channel);
                      }}
                      className="h-7 w-7 object-cover rounded-xl  mx-5"
                      src={subscribedChannel.channel.avatar}
                      alt="avatar"
                    />
                    <h2
                      onClick={() => {
                        handleChannelClick(subscribedChannel.channel);
                      }}
                    >
                      {subscribedChannel.channel.fullName}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-[84%] bg-black  h-lvh  overflow-y-auto scrollbar-hover">
            {loading ? (
              <div className="p-4 flex justify-center text-white">Loading videos...</div>
            ) : error ? (
              <div className="p-4 text-red-400 ">Error loading videos.</div>
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
