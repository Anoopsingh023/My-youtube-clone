import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("access Token" , accessToken)
    // console.log("refresh Token" , refreshToken)

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registrUser = asyncHandler(async (req, res) => {
  // get data fron frontend
  // check for validation
  // check if user already exist
  // upload file -- check avatar
  // upload on cloudinary
  // create user object,  create entry in data
  // remove password and refresh token from response
  // check for user creation
  // return response

  const { username, fullName, email, password } = req.body;

  if (
    [username, fullName, email, password].some((field) => field?.trim === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user with username or email already exist");
  }

  // const avatarLocalPath = req.file?.avatar[0]?.path;
  // const coverImageLocatPath = req.file?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Somthing went wrong while uploading the user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get user data
  // validation
  // find user in database
  // password cheack
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body;
  // console.log(email)

  if (!(email || username)) {
    throw new apiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(404, "user does not exist");
  }

  const isPassordValid = await user.isPasswordCorrect(password);

  if (!isPassordValid) {
    throw new apiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new apiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // remove the fileld from document
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new apiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get refresh token
  // decode it
  // get user
  // compare refresh token from database
  // update access and refresh token
  // return access token in cookie

  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    // console.log("access Token" , accessToken)
    // console.log("refresh Token" , refreshToken)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPasswaord = asyncHandler(async (req, res) => {
  // get old and new password from user
  // get saved password from database
  // compare it with old password given by user
  // set and save new password
  // re4turn res

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  console.log(user);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetail = asyncHandler(async (req, res) => {
  // get fullname and email from user
  // validation
  // get user from database
  // update details
  // return res

  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Account detail updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // get file in local server
  // validation
  // delete old image from cloudinary
  // upload on cloudinary
  // save cloudinary link in database
  // return res

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  const oldAvatar = await User.findById(req.user?._id);
  const deleteOldAvatarImage = await deleteImageFromCloudinary(
    oldAvatar?.avatar
  );

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new apiError(400, "Error while uploading image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar image updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new apiError(400, "Image is required");
  }

  const oldCoverImage = await User.findById(req.user?._id);
  const deleteOldCoverImage = await deleteImageFromCloudinary(
    oldCoverImage?.coverImage
  );

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new apiError(400, "Error while uploading image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover image updated successfully"));
});

const userChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username.trim()) {
    throw new apiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json(new apiResponse(404, null, "User not found"));

  // Check if the video is already in history
  const alreadyWatched = user.watchHistory.find(
    (entry) => entry.video.toString() === videoId
  );

  if (!alreadyWatched) {
    user.watchHistory.push({ video: videoId });
  } else {
    // Update the timestamp to reflect recent watch
    alreadyWatched.watchedAt = new Date();
  }

  // Optional: limit history size (e.g., 50 entries)
  if (user.watchHistory.length > 50) {
    user.watchHistory = user.watchHistory.slice(-50);
  }

  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, user.watchHistory, "Watch history updated"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const history = await User.aggregate([
    { $match: { _id: userId } },
    { $unwind: "$watchHistory" },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory.video",
        foreignField: "_id",
        as: "videoData",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
    { $unwind: "$videoData" },
    {
      $project: {
        _id: 0,
        watchedAt: "$watchHistory.watchedAt",
        video: "$videoData",
      },
    },
    { $sort: { watchedAt: -1 } }, // latest first
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, history, "Watch history fetched successfully"));
});

const removeFromWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const initialLength = user.watchHistory.length;

  // Remove the matching videoId from watchHistory
  user.watchHistory = user.watchHistory.filter(
    (entry) => entry.video.toString() !== videoId
  );

  if (user.watchHistory.length === initialLength) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Video not found in history"));
  }

  await user.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user.watchHistory,
        "Video removed from watch history"
      )
    );
});

const clearWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  user.watchHistory = []; // Clear the entire array
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, [], "Watch history cleared"));
});

const getUserById = asyncHandler(async (req, res) => {
  // const {UserId} = req.params

  const user = await User.findById(req.params.userId).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new apiResponse(200, user, "User fetched successfully"));
});

const togglePlaylistInWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid playlist ID"));
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Playlist not found"));
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  const index = user.watchLaterPlaylists.findIndex(
    (id) => id.toString() === playlistId
  );

  let message = "";

  if (index !== -1) {
    // Playlist exists, remove it
    user.watchLaterPlaylists.splice(index, 1);
    message = "Playlist removed from Watch Later";
  } else {
    // Playlist does not exist, add it
    user.watchLaterPlaylists.push(playlistId);
    message = "Playlist added to Watch Later";
  }

  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, user.watchLaterPlaylists, message));
});

const getWatchLaterPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate({
      path: "watchLaterPlaylists",
      populate: {
        path: "videos",
        select: "title thumbnail", // minimal payload
      },
    })
    .select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user.watchLaterPlaylists,
        "Watch Later playlists fetched successfully"
      )
    );
});

const isPlaylistInWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId } = req.params; // or req.query.playlistId if you prefer

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid playlist ID"));
  }

  const user = await User.findById(userId).select("watchLaterPlaylists"); // minimal fetch

  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const isAdded = user.watchLaterPlaylists?.some(
    (id) => id.toString() === playlistId
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { playlistId, isAdded },
        "Watch Later status fetched successfully"
      )
    );
});

export {
  registrUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPasswaord,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateCoverImage,
  userChannelProfile,
  addToWatchHistory,
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
  getUserById,
  togglePlaylistInWatchLater,
  getWatchLaterPlaylists,
  isPlaylistInWatchLater,
};
