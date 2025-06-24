import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Comment = (video) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("des");

  useEffect(() => {
    getVideoComments();
  }, [sortBy,video.message._id]);

  const getVideoComments = () => {
    axios
      .get(`http://localhost:8000/api/v1/comments/${video.message._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Video Comments", res.data.data.comments);
        if(sortBy == "asc"){
            setComments(res.data.data.comments)
        }
        else{
            setComments(res.data.data.comments.reverse());
        }
        setContent("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:8000/api/v1/comments/${video.message._id}`,
        {
          content: content,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("comment", res.data);
        getVideoComments();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSortBy = (e)=>{
    setSortBy(e.target.value)
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5">
          <h4 className="text-2xl font-medium">30 Comments</h4>
          <select className="bg-[#232222] rounded-xl p-2 outline-none"  name="sortBy" id="" value={sortBy} onChange={handleSortBy} >
            <option className="bg-[#2d2d2d] rounded-2xl hover:bg-[#4e4e4e]" value="des">newest first</option>
            <option className="bg-[#2d2d2d] rounded-2xl hover:bg-[#4e4e4e]" value="asc">oldest first</option>
          </select>
        </div>
        <div className="flex flex-row ">
          <img
            className="h-10 w-10 rounded-4xl"
            src={localStorage.getItem("avatar")}
            alt="avatar"
          />
          <form onSubmit={submitHandler} className="w-full mx-5" action="">
            <input
              onChange={(e) => {
                setContent(e.target.value);
              }}
              value={content}
              className="text-white border-b-1 border-[#c5c4c4] w-full pb-1 outline-none"
              type="text"
              placeholder="Add a comment..."
            />
            <div className="flex flex-row-reverse gap-5 my-2">
              <button
                className="cursor-pointer bg-[#4da9ffe2] hover:bg-[#89bff1e1] duration-300 text-black px-4 py-1 rounded-4xl"
                type="submit"
              >
                Comment
              </button>
              <button
                className="cursor-pointer hover:bg-[#5b5b5be2] duration-500  px-4 py-1 rounded-4xl"
                type="reset"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex flex-row gap-4 ">
              <img
                className="h-10 w-10 rounded-4xl"
                src={comment.owner.avatar}
                alt=""
              />
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2">
                  <h4>{comment.owner.username}</h4>
                  <div className="text-sm text-gray-400">
                    {comment.createdAt ? (
                      <p>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        }).replace(/^about /, "")}
                      </p>
                    ) : (
                      <p>Unknown time</p>
                    )}
                  </div>
                </div>
                <p>{comment.content}</p>
                <div className="flex flex-row gap-5">
                  <p>
                    <i class="fa-regular fa-thumbs-up mr-2"></i>20
                  </p>
                  <p>
                    <i class="fa-regular fa-thumbs-down"></i>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
