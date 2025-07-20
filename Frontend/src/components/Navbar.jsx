import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/constant";
import {logo} from "../assets/logo.jpg"

const Navbar = ({ isEnabled , onSearch,onToggleSidebar}) => {
  const navigate = useNavigate();
  const [logedin, setLogedin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLogedin(true);
    }
  }, [logedin]);

 
  const menus = ["Your Channel", "Theme", "Help", "Send feedback", "Logout"];
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    axios
      .post(
        `${base_url}/api/v1/users/logout`,
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

  const handleMenuClick = (menu) => {
    switch (menu) {
      case "Logout":
        // Perform logout
        logout();

        break;
      case "Your Channel":
        // Navigate to user's channel
        window.open(`/channel/${localStorage.getItem("userName")}`, "_blank");
        break;
      default:
        // Default behavior
        break;
    }
    setOpen(false)
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    if (onSearch) {
      onSearch(query); // Send search query to parent
    }
  };

  return (
    <>
      <nav className="flex flex-row sticky items-center justify-between px-5  py-3  mr-5 text-white font-bold ">
        <div className="flex flex-row gap-2 items-center">
          <i onClick={onToggleSidebar} className="fa-solid fa-bars hover:bg-[#3b3b3b] p-3 cursor-pointer rounded-full"></i>
          
          <img
            className="h-12 p-2 rounded-2xl "
            src={logo}
            alt="logo"
          />
          <h2>My YouTube</h2>
        </div>
        <form className="flex flex-row items-center  " action="">
          <input
            className="z-10 bg-black border border-[#343434] w-96 p-2 pl-4 rounded-l-4xl focus:outline-1 focus:outline-offset-0 focus:outline-[#4a88e5]  "
            type="text"
            placeholder="Search"
            onChange={handleSearchInput}
          />
          <button
            className="z-5 bg-[#272626] h-10.5 w-15 rounded-r-4xl cursor-pointer"
            type="submit"
          >
            <i class="fa fa-search "></i>
          </button>
        </form>

        {/* ======= Avatar Image ======= */}
        {logedin ? (
          <div className="flex flex-col">
            <div ref={dropdownRef} className="relative  ">
              <img
                onClick={() => setOpen((open) => !open)}
                className="h-12 rounded-4xl w-12 cursor-pointer"
                src={localStorage.getItem("avatar")}
                alt=""
              />
              {open && (
                <div className="bg-[#383838] absolute w-56 z-50  -left-45 top-13 p-5 m-3 rounded-2xl ">
                  <div className="flex flex-row gap-4 items-center ">
                    <img
                      className="h-10 w-10 rounded-4xl"
                      src={localStorage.getItem("avatar")}
                      alt=""
                    />
                    <div className="flex flex-col ">
                      <h4>{localStorage.getItem("name")}</h4>
                      <p>{localStorage.getItem("userName")}</p>
                    </div>
                  </div>
                  <hr className="text-[#848282] bg-amber-50 my-2 " />
                  <ul>
                    {menus.map((menu, index) => (
                      <li
                        key={index}
                        onClick={() => handleMenuClick(menu)}
                        className="py-2 px-4 duration-300 rounded-xl hover:bg-[#565555] cursor-pointer"
                      >
                        {menu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <Link to={"/login"} className="bg-[#3b3b3b] px-4 py-2 rounded-4xl">
              Login
            </Link>
            <Link to={"/signup"} className="bg-[#3b3b3b] px-4 py-2 rounded-4xl">
              Signup
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
