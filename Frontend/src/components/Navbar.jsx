import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/constant";
import logo from "../assets/logo.jpg";
import { ArrowLeft } from "lucide-react";

const Navbar = ({ onSearch, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [logedin, setLogedin] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSearchInput, setOpenSearchInput] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("token")) setLogedin(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      .then(() => {
        ["token", "userId", "userName", "avatar", "coverImage", "name"].forEach(
          (item) => localStorage.removeItem(item)
        );
        setLogedin(false);
        window.location.href = "/dashboard";
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
    setOpen(false);
  };

  const handleSearchInput = (e) => {
    // Can be connected to a global search if needed
    const query = e.target.value;
    if (onSearch) {
      onSearch(query); // Send search query to parent
    }
  };

  const handleFeedbackClick = () => {
    navigate(`/dashboard/feedback`);
  };

  return (
    <nav className="flex items-center justify-between px-5 py-3 text-white sticky top-0 z-40 ">
      {openSearchInput ? (
        // Full-width search view
        <div className="flex items-center w-full gap-2">
          <ArrowLeft
            onClick={() => setOpenSearchInput(false)}
            size={22}
            className="cursor-pointer"
          />
          <input
            autoFocus
            className="bg-black border border-[#343434] w-full p-2 pl-4 rounded-4xl focus:outline-[#4a88e5]"
            type="text"
            placeholder="Search"
            onChange={handleSearchInput}
          />
        </div>
      ) : (
        <>
          {/* Left Side */}
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle - Hidden on Mobile */}
            <span className="hidden sm:block">
              <i
                onClick={onToggleSidebar}
                className="fa-solid fa-bars hover:bg-[#3b3b3b] p-3 cursor-pointer rounded-full"
              />
            </span>

            {/* Logo - Visible on Desktop */}
            <img src={logo} alt="logo" className="h-12 p-2 rounded-2xl " />

            {/* My YouTube - Show on Mobile */}
            <h2 className="sm:hidden font-bold">My YouTube</h2>

            {/* My YouTube - Show on Desktop too */}
            <h2 className="hidden sm:block font-bold">My YouTube</h2>
          </div>

          {/* Middle: Search bar - Hidden on Mobile */}
          <form className="hidden md:flex flex-row items-center">
            <input
              className="bg-black border border-[#343434] w-96 p-2 pl-4 rounded-l-4xl focus:outline-[#4a88e5]"
              type="text"
              placeholder="Search"
              onChange={handleSearchInput}
            />
            <button
              className="bg-[#272626] h-10 w-12 rounded-r-4xl"
              type="submit"
            >
              <i className="fa fa-search" />
            </button>
          </form>

          {/* Right Side */}
          {logedin ? (
            <>
              {/* Avatar - Hidden on Mobile */}
              <div className="flex flex-row gap-4">
                <button
                  onClick={handleFeedbackClick}
                  className="border border-[#6f6d6d] bg-[#232323] py-2 px-3 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
                >
                  Feedback
                </button>
                <div className=" flex-col hidden sm:block">
                  <div ref={dropdownRef} className="relative">
                    <img
                      onClick={() => setOpen((o) => !o)}
                      className="h-12 w-12 rounded-full cursor-pointer"
                      src={localStorage.getItem("avatar")}
                      alt=""
                    />
                    {open && (
                      <div className="bg-[#383838] absolute w-56 z-50 -left-45 top-14 p-5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={localStorage.getItem("avatar")}
                            alt=""
                          />
                          <div>
                            <h4>{localStorage.getItem("name")}</h4>
                            <p>{localStorage.getItem("userName")}</p>
                          </div>
                        </div>
                        <hr className="my-2 border-[#848282]" />
                        <ul>
                          {[
                            "Your Channel",
                            "Theme",
                            "Help",
                            "Logout",
                          ].map((menu, index) => (
                            <li
                              key={index}
                              onClick={() => handleMenuClick(menu)}
                              className="py-2 px-4 hover:bg-[#565555] rounded-xl cursor-pointer"
                            >
                              {menu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Search icon for Mobile */}
              <span className=" sm:hidden">
                <i
                  onClick={() => setOpenSearchInput(true)}
                  className="fa fa-search  text-xl cursor-pointer"
                ></i>
              </span>
            </>
          ) : (
            <div className="flex gap-2">
              {/* Login Button hidden on Mobile, show search icon */}
              <button
                  onClick={handleFeedbackClick}
                  className="border border-[#6f6d6d] bg-[#232323] py-2 px-3 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
                >
                  Feedback
                </button>
              <Link
                to="/login"
                className="border bg-[#232323] py-2 px-4 rounded-full cursor-pointer text-blue-400 hover:bg-[#4c9ed566]"
              >
                <i class="fa-regular fa-user"></i> Sign in
              </Link>
              <span className=" sm:hidden">
                <i
                  onClick={() => setOpenSearchInput(true)}
                  className="fa fa-search  text-xl cursor-pointer"
                ></i>
              </span>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
