import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../utils/constant";
import { FaCamera } from "react-icons/fa"; // Optional icon library

const UserProfile = () => {
  const [previewAvatar, setPreviewAvatar] = useState("/default-avatar.png");
  const [previewCover, setPreviewCover] = useState("/default-cover.jpg");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [activeModal, setActiveModal] = useState(""); // "avatar" | "cover" | ""
  const [imageToUpload, setImageToUpload] = useState(null);

  useEffect(() => {
    // axios.get(`${base_url}/api/v1/users/current-user`, { withCredentials: true }).then((res) => {
    //   const { avatar, coverImage, name, userName, email } = res.data;
    //   console.log("Current user", res.data)
    //   if (avatar) setPreviewAvatar(avatar);
    //   if (coverImage) setPreviewCover(coverImage);
    //   setFullName(name);
    //   setUsername(userName);
    //   setEmail(email);
    // });
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    axios
      .get(`${base_url}/api/v1/users/current-user`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Current user", res.data);
        const { avatar, coverImage, fullName, username, email } = res.data.data;
        // console.log("Current user", res.data)
        if (avatar) setPreviewAvatar(avatar);
        if (coverImage) setPreviewCover(coverImage);
        setFullName(fullName);
        setUsername(username);
        setEmail(email);
      })
      .catch((err) => {
        console.error("Error Current user", err);
      });
  };

  const handleUpload = async () => {
    if (!imageToUpload || !activeModal) return;

    const formData = new FormData();
    formData.append(
      activeModal === "avatar" ? "avatar" : "coverImage",
      imageToUpload
    );

    try {
      const res = await axios.patch(
        `/api/user/${activeModal === "avatar" ? "avatar" : "cover-image"}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (activeModal === "avatar") setPreviewAvatar(res.data?.url);
      else setPreviewCover(res.data?.url);
      setActiveModal("");
      setImageToUpload(null);
      alert(`${activeModal} updated!`);
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 rounded-xl overflow-hidden shadow-lg bg-[#1e1e1e] text-white relative">
      {/* Cover Image */}
      <div className="relative group">
        <img
          src={previewCover}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setActiveModal("cover")}
          className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hidden group-hover:block"
        >
          <FaCamera className="text-white" />
        </button>
      </div>

      {/* Avatar */}
      <div className="absolute top-32 left-6 group">
        <img
          src={previewAvatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <button
          onClick={() => setActiveModal("avatar")}
          className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full hidden group-hover:block"
        >
          <FaCamera className="text-white" />
        </button>
      </div>

      {/* User Info */}
      <div className="pt-20 pb-6 px-6 mt-12">
        <h2 className="text-2xl font-bold">{fullName}</h2>
        <p className="text-gray-400">@{username}</p>
        <p className="text-gray-400">{email}</p>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-sm text-white relative">
            <h3 className="text-lg font-semibold mb-4">
              Update {activeModal === "avatar" ? "Avatar" : "Cover Image"}
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageToUpload(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveModal("")}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
