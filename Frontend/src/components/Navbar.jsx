import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../utils/constant";
import logo from "../assets/logo.jpg";

const Navbar = ({onSearch, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [logedin, setLogedin] = useState(false);
  const [open, setOpen] = useState(false);
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
      .post(`${base_url}/api/v1/users/logout`, {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        ["token", "userId", "userName", "avatar", "coverImage", "name"].forEach(
          (item) => localStorage.removeItem(item)
        );
        setLogedin(false);
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
    // Can be connected to a global search if needed
    const query = e.target.value;
    if (onSearch) {
      onSearch(query); // Send search query to parent
    }
  };

  return (
    <nav className="flex items-center justify-between px-5 py-3 text-white bg-[#0f0f0f] sticky top-0 z-40">
      {/* Left: Toggle + Logo */}
      <div className="flex items-center gap-2">
        <i
          onClick={onToggleSidebar}
          className="fa-solid fa-bars hover:bg-[#3b3b3b] p-3 cursor-pointer rounded-full"
        />
        <img src={logo} alt="logo" className="h-12 p-2 rounded-2xl" />
        <h2 className="hidden sm:block font-bold">My YouTube</h2>
      </div>

      {/* Middle: Search */}
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

      {/* Right: Profile / Auth */}
      {logedin ? (
        <div className="flex flex-col">
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
                  {["Your Channel", "Theme", "Help", "Send feedback", "Logout"].map(
                    (menu, index) => (
                      <li
                        key={index}
                        onClick={() => handleMenuClick(menu)}
                        className="py-2 px-4 hover:bg-[#565555] rounded-xl cursor-pointer"
                      >
                        {menu}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="bg-[#3b3b3b] px-4 py-2 rounded-4xl">Login</Link>
          <Link to="/signup" className="bg-[#3b3b3b] px-4 py-2 rounded-4xl">Signup</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
