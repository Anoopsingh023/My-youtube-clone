// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { base_url } from "../utils/constant";
// import logo from "../assets/logo.jpg"

// function Login() {
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [isLoading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     axios
//       .post(`${base_url}/api/v1/users/login`, {
//         email: email,
//         password: password,
//       })
//       .then((res) => {
//         console.log(res.data);
//         setLoading(false);
//         navigate("/dashboard");
//         localStorage.setItem("token", res.data.data.accessToken);
//         localStorage.setItem("userId", res.data.data.user._id);
//         localStorage.setItem("userName", res.data.data.user.username);
//         localStorage.setItem("avatar", res.data.data.user.avatar);
//         localStorage.setItem("coverImage", res.data.data.user.coverImage);
//         localStorage.setItem("name", res.data.data.user.fullName);

//         // toast(res.data.message)
//         toast("Welcome to my youtube");
//       })
//       .catch((error) => {
//         console.log(error.response);
//         setLoading(false);
//         toast.error("Invalid email or password");
//       });
//   };

//   return (
//     <>
//       <div className="flex justify-center items-center h-screen w-full bg-black-300">
//         <div className="flex flex-col justify-center items-center gap-4  w-2xl shadow-xl bg-gray-500 py-10">
//           <div className="flex gap-3 justify-center items-center">
//             <img className="w-20 h-15  rounded-2xl" src={logo} alt="logo" />
//             <h2 className="text-2xl text-white">LogIn</h2>
//           </div>

//           <div className="flex flex-col">
//             <form
//               className="flex flex-col gap-4 justify-center items-center"
//               action=""
//               onSubmit={submitHandler}
//             >
//               <input
//                 className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl "
//                 type="email"
//                 placeholder="email"
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                 }}
//                 required
//               />

//               <input
//                 className="mx-2 bg-amber-50 rounded-4xl space-x-2 placeholder:text-slate-400 text-slate-700 px-5 w-80 h-8 shadow-xl"
//                 type="password"
//                 placeholder="Passward"
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                 }}
//                 required
//               />

//               <button
//                 className="bg-red-600 rounded-4xl w-35 h-10 m-2 cursor-pointer shadow-xl"
//                 type="submit"
//               >
//                 {isLoading && (
//                   <i className="fa-solid fa-spinner fa-spin-pulse"></i>
//                 )}{" "}
//                 Submit
//               </button>
//               <Link className="text-white" to={"/signup"}>
//                 Create your account
//               </Link>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "../utils/constant";
import logo from "../assets/logo.jpg";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${base_url}/api/v1/users/login`, { email, password })
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

        toast("Welcome to my youtube");
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
        toast.error("Invalid email or password");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-black px-4">
      <div className="flex flex-col justify-center items-center gap-6 w-full max-w-md shadow-xl bg-gray-800 py-10 px-6 rounded-lg">
        {/* Logo and Title */}
        <div className="flex gap-3 justify-center items-center">
          <img className="w-16 h-10 rounded-lg" src={logo} alt="logo" />
          <h2 className="text-3xl font-semibold text-white">Login</h2>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={submitHandler}
        >
          <input
            className="bg-amber-50 rounded-lg placeholder:text-slate-400 text-slate-700 px-4 py-2 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with toggle */}
          <div className="relative w-full">
            <input
              className="bg-amber-50 rounded-lg placeholder:text-slate-400 text-slate-700 px-5 w-full h-10 shadow-xl pr-10"
              type={showPassword ? "text" : "password"} // 👈 Toggle here
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"} {/* Icon changes */}
            </button>
          </div>

          <button
            className="bg-red-600 hover:bg-red-700 transition-all rounded-lg py-2 text-white font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit
          </button>

          <Link className="text-sm text-center text-blue-300 hover:underline" to={"/signup"}>
            Create your account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
