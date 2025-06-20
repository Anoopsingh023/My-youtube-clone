import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const [subscribedChannels, setSubscribedChannel] = useState([]);

  useEffect(() => {
    getSubscribedChannel();
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
        console.log("subscribed channels by user",res.data);
        const userData = res.data?.data?.[0]; // null-safe access
        const channels = userData?.subscribedChannel || []; // fallback to empty array
        setSubscribedChannel(channels);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const handleProfileClick = ()=>{
    navigate(`/dashboard/${localStorage.getItem("userName")}`)
  }

  const handleChannelClick = (userName)=>{
    navigate(`/dashboard/${userName}`)
  }

  return (
    <div className="flex flex-col">
      <nav className="flex flex-row sticky items-center gap-[28%]  h-15 p-3 bg-black text-white font-bold ">
        <div className="flex flex-row gap-2 items-center">
          {/* <i className="fa-solid fa-bars "></i> */}
          <img className="h-12 rounded-2xl " src="./img/logo.jpg" alt="logo" />
          <h2>My YouTube</h2>
        </div>
        <form className="flex flex-row items-center  " action="">
          <input
            className="z-10 border border-[#343434] w-96 p-2 pl-4 rounded-l-4xl focus:outline-1 focus:outline-offset-0 focus:outline-[#4a88e5]  "
            type="text"
            placeholder="Search"
          />
          <button
            className="z-5 bg-[#343434] h-10.5 w-15 rounded-r-4xl cursor-pointer"
            type="submit"
          >
            <i class="fa fa-search "></i>
          </button>
        </form>
        <img
          onClick={handleProfileClick}
          className="h-12 rounded-4xl w-12 cursor-pointer"
          src={localStorage.getItem("avatar")}
          alt=""
        />
      </nav>
      <div className="flex ">
        <div className="w-[16%] bg-black h-lvh fixed overflow-y-auto overflow-hidden scrollbar-hover ">
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
              to={"/dashboard/logout"}
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
                  onClick={()=>{handleChannelClick(subscribedChannel.channel.username)}}
                  className="flex flex-row items-center hover:bg-[#3b3b3b] w-[90%] py-2 duration-300 rounded-xl cursor-pointer"
                  key={subscribedChannel._id}
                >
                  <img
                  onClick={()=>{handleChannelClick(subscribedChannel.channel.username)}}
                    className="h-7 w-7 object-cover rounded-xl  mx-5"
                    src={subscribedChannel.channel.avatar}
                    alt="avatar"
                  />
                  <h2 onClick={()=>{handleChannelClick(subscribedChannel.channel.username)}}>{subscribedChannel.channel.fullName}</h2>
                </div>
              ))}
            </div>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt,
              enim excepturi corporis distinctio perferendis minima sapiente
              aspernatur provident? Consectetur esse minima incidunt repellat,
              dolor earum perspiciatis. Exercitationem quis voluptatem suscipit.
            </p>
          </div>
        </div>

        <div className="w-[84%] bg-black ml-[16%] h-lvh fixed overflow-y-auto scrollbar-hover">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
