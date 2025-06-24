import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videFileUrl, setVideoFileUrl] = useState("")
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [isLoading, setLoading] = useState(false);

  const videoFileHandler = (e)=>{
    setVideoFile(e.target.files[0])
    setVideoFileUrl(URL.createObjectURL(e.target.files[0]))
  }

  const thumbnailFileHandler = (e)=>{
    setThumbnail(e.target.files[0])
    setThumbnailUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e)=>{
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("videoFile",videoFile)
    formData.append("thumbnail",thumbnail)

    axios
    .post("http://localhost:8000/api/v1/videos/publish", formData,{
      headers:{
        Authorization: "Bearer "+ localStorage.getItem("token")
      }
    })
    .then((res)=>{
      console.log(res.data)
      setLoading(false)
      toast(res.data.message)
    })
    .catch((err)=>{
      console.log(err)
      setLoading(false)
      toast.error(err.response.statusText)
    })
  }

  return (
    <div className="flex flex-col justify-center items-center ">
      <h2 className="text-white my-5 text-3xl font-bold">Upload Video</h2>
      <form
        onSubmit={submitHandler}
        action=""
        className="flex flex-col gap-3 w-[70%] p-10 bg-[#343434] shadow-lg shadow-[#737272]  "
      >
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
          className="bg-white mx-5 h-10 p-5 rounded-sm"
          type="text"
          placeholder="title"
        />
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          required
          className="bg-white mx-5 p-5 pt-1 h-25 rounded-sm"
          name="description"
          id=""
          placeholder="description"
        ></textarea>
        <div className="text-[#454343]  bg-white mx-5 px-5 py-2 flex flex-row items-center gap-3 rounded-sm">
          <label className="cursor-pointer " htmlFor="videofile">
            Choose Video File
          </label>
          <input  onChange={videoFileHandler} className="cursor-pointer hidden " type="file" id="videofile" />
          
          {videFileUrl &&<iframe className="w-[60%] m-auto" src={videFileUrl} frameborder="0"></iframe>}
        </div>
        <div className="text-[#454343] bg-white mx-5 px-5 py-2 flex flex-row items-center gap-3 rounded-sm">
          <label className="cursor-pointer " htmlFor="thumbnail">
            Choose Thumbnail File 
          {/* <i class="fa-solid fa-square-plus "></i> */}
          </label>
          <input  onChange={thumbnailFileHandler} className="cursor-pointer hidden" type="file" id="thumbnail" />
          {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" className="h-20 w-25 m-auto rounded-sm"/>}
        </div>
        <button className="bg-[#cf0a17] h-10 mx-5 rounded-sm text-white font-medium text-lg cursor-pointer">{isLoading && (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                )}{" "}Submit</button>
      </form>
    </div>
  );
};

export default UploadVideo;
