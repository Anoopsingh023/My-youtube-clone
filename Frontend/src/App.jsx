import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
 import { ToastContainer, toast } from 'react-toastify';
import Home from "./components/Dashboard/Home";
import MyVideo from "./components/Dashboard/Myvideo";
import UploadVideo from "./components/Dashboard/UploadVideo"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Signup/>
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    children: [
      {path: "home", element: <Home/>},
      {path: "my-video", element: <MyVideo/>},
      {path: "upload-video", element: <UploadVideo/>}
    ]
  }
])

function App() {
  return (
    <>
    <div>
      <RouterProvider router={appRouter}/>
      <ToastContainer/>
    </div>
    </>
  );
}

export default App;
