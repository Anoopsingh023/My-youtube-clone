import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import Home from "./components/Dashboard/Home";
import ChannelProfile from "./components/Dashboard/ChannelProfile";
import UploadVideo from "./components/Dashboard/UploadVideo";
import VideoPage from "./components/Dashboard/VideoPage";
import Logout from "./components/logout";
import { Channel } from "./components/userChannel/Channel";
import UserVideos from "./components/userChannel/UserVideos"
import UserPlaylist from "./components/userChannel/UserPlaylist";
import UserTweets from "./components/userChannel/UserTweets";
import UpdateUserVideo from "./components/userChannel/UpdateUserVideo";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: ":username", element: <ChannelProfile /> },
      { path: "upload-video", element: <UploadVideo /> },
      { path: "video-page", element: <VideoPage /> },
      { path: "logout", element: <Logout /> },
    ],
  },
  {
    path: "/channel/:username",
    element: <Channel />,
    children: [
      {path: "", element: <UserVideos/>},
      {path: "user-videos", element: <UserVideos/>},
      {path: "user-playlist", element: <UserPlaylist/>},
      {path: "user-tweets", element: <UserTweets/>},
      {path: "update-video/:videoId", element: <UpdateUserVideo/>},
      {path: "upload-video", element: <UploadVideo/>}
    ]
  },
]);

function App() {
  return (
    <>
      <div>
        <RouterProvider router={appRouter} />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
