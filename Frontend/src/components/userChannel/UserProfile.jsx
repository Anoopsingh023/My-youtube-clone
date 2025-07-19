import React from "react";

const UserProfile = () => {
  const avatar = localStorage.getItem("avatar") || "/default-avatar.png";
  const coverImage = localStorage.getItem("coverImage") || "/default-cover.jpg";
  const fullName = localStorage.getItem("name") || "John Doe";
  const username = localStorage.getItem("userName") || "username123";

  return (
    <div className="max-w-3xl mx-auto mt-8 rounded-xl overflow-hidden shadow-lg bg-[#1e1e1e] text-white">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-6 px-6">
        <h2 className="text-2xl font-bold">{fullName}</h2>
        <p className="text-gray-400">@{username}</p>
      </div>
    </div>
  );
};

export default UserProfile;
