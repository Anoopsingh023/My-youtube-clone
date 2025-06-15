import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

  const avatarFileHandler = (e) => {
    console.log(e.target.files[0]);
    setAvatar(e.target.files[0]);
    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
  };

  const coverImageFileHandler = (e) => {
    setCoverImage(e.target.files[0]);
    setCoverImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    axios
      .post("http://localhost:8000/api/v1/users/register", formData)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        // navigate("/login")
        toast(res.data.message);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.response.statusText);
      });
  };
  //  http://localhost:8000/api/v1/users/register

  return (
    <>
      <div className="flex justify-center items-center h-screen w-full bg-black-300">
        <div className="flex flex-col justify-center items-center gap-4  w-2xl shadow-xl bg-gray-500 py-10">
          <div className="flex gap-3 justify-center items-center">
            <img className="w-20 h-15" src="../img/logo.jpg" alt="logo" />
            <h2 className="text-2xl text-white">My YouTube</h2>
          </div>
          <div className="flex flex-col">
            <form
              className="flex flex-col gap-3 justify-center items-center"
              action=""
              onSubmit={submitHandler}
            >
              <input
                className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl"
                type="text"
                placeholder="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />

              <input
                className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl"
                type="text"
                placeholder="Full Name"
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                required
              />

              <input
                className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl"
                type="email"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />

              <input
                className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl"
                type="password"
                placeholder="Passward"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />

              <div className="flex  gap-2 text-white">
                <label htmlFor="avatar" className="cursor-pointer">
                  Avatar Image
                </label>
                <input
                  id="avatar"
                  required
                  accept="image/*"
                  type="file"
                  className="hidden"
                  onChange={avatarFileHandler}
                />
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Avatar img"
                    className="w-10 h-10 shadow-xl"
                  />
                )}
              </div>

              <div className="flex   text-white">
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer items-start"
                >
                  Cover Image{" "}
                </label>
                <input
                  id="coverImage"
                  title=" "
                  accept="image/*"
                  type="file"
                  className="hidden"
                  onChange={coverImageFileHandler}
                />
                {coverImageUrl && (
                  <img
                    src={coverImageUrl}
                    alt="Cover img"
                    className="w-10 h-10 shadow-xl"
                  />
                )}
              </div>

              <button
                className="bg-red-600 rounded-4xl w-35 h-10 cursor-pointer shadow-xl"
                type="submit"
              >
                {isLoading && (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                )}{" "}
                Submit
              </button>
              <Link className="text-white" to={"/login"}>
                Login with your account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
