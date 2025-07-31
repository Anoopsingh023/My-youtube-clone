import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import Home from "./components/Dashboard/Home";
import ChannelProfile from "./components/Dashboard/ChannelProfile";
import UploadVideo from "./components/Dashboard/UploadVideo";
import VideoPage from "./components/Dashboard/VideoPage";
import { Channel } from "./components/userChannel/Channel";
import UserVideos from "./components/userChannel/UserVideos"
import UserPlaylist from "./components/userChannel/UserPlaylist";
import UserTweets from "./components/userChannel/UserTweets";
import UpdateUserVideo from "./components/userChannel/UpdateUserVideo";
import PlaylistPage from "./components/userChannel/PlaylistPage";
import UserProfile from "./components/userChannel/UserProfile";
import ShortPage from "./components/Dashboard/ShortPage";
import Subscription from "./components/Dashboard/Subscription";
import LikedVideos from "./components/Dashboard/LikedVideos";
import WatchLater from "./components/Dashboard/WatchLater";
import SavedPlaylist from "./components/Dashboard/SavedPlaylist";
import History from "./components/Dashboard/History";
import Playlist from "./components/Dashboard/Playlist";
import WatchPage from "./components/Dashboard/WatchPage";

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
      { path: "video/:videoId", element: <WatchPage /> },
      { path: "short-page", element: <ShortPage /> },
      { path: "subscription", element: <Subscription /> },
      { path: "liked-videos", element: <LikedVideos /> },
      { path: "watch-later", element: <WatchLater /> },
      { path: "saved-playlist", element: <SavedPlaylist /> },
      { path: "history", element: <History /> },
      { path: "playlist/:playlistId", element: <Playlist /> },
    ],
  },
  {
    path: "/channel/:username",
    element: <Channel />,
    children: [
      {path: "", element: <UserProfile/>},
      {path: "user-profile", element: <UserProfile/>},
      {path: "user-videos", element: <UserVideos/>},
      {path: "user-playlist", element: <UserPlaylist/>},
      {path: "user-tweets", element: <UserTweets/>},
      {path: "update-video/:videoId", element: <UpdateUserVideo/>},
      {path: "upload-video", element: <UploadVideo/>},
      {path: ":playlistId", element: <PlaylistPage/>}
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
