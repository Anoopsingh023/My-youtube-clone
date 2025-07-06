import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:8000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        navigate("/dashboard");
        localStorage.setItem("token", res.data.data.accessToken);
        localStorage.setItem("userId", res.data.data.user._id);
        localStorage.setItem("userName", res.data.data.user.username);
        localStorage.setItem("avatar", res.data.data.user.avatar);
        localStorage.setItem("coverImage", res.data.data.user.coverImage);
        localStorage.setItem("name", res.data.data.user.fullName);

        // toast(res.data.message)
        toast("Welcome to my youtube");
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
        toast.error("Invalid email or password");
      });
  };
  //  http://localhost:8000/api/v1/users/register

  return (
    <>
      <div className="flex justify-center items-center h-screen w-full bg-black-300">
        <div className="flex flex-col justify-center items-center gap-4  w-2xl shadow-xl bg-gray-500 py-10">
          <div className="flex gap-3 justify-center items-center">
            <img className="w-20 h-15  rounded-2xl" src="../src/assets/logo.jpg" alt="logo" />
            <h2 className="text-2xl text-white">LogIn</h2>
          </div>

          <div className="flex flex-col">
            <form
              className="flex flex-col gap-4 justify-center items-center"
              action=""
              onSubmit={submitHandler}
            >
              <input
                className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl "
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

              <button
                className="bg-red-600 rounded-4xl w-35 h-10 m-2 cursor-pointer shadow-xl"
                type="submit"
              >
                {isLoading && (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                )}{" "}
                Submit
              </button>
              <Link className="text-white" to={"/signup"}>
                Create your account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
