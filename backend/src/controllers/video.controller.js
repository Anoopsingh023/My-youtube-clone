import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import {View} from "../models/views.model.js"
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const getAllVideo = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  // get all video based of query
  // sort them

  const skip = (page - 1) * limit;
  const sortOption = { [sortBy]: sortType === "asc" ? 1 : -1 };

  const filter = {};

  // Text search
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  // User filter
  if (userId) {
    filter.user = userId;
  }

  const totalVideos = await Video.countDocuments(filter);
  const videos = await Video.find(filter)
    .populate("owner", "username fullName avatar")
    .sort(sortOption)
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  return res.status(200).json(
    new apiResponse(
      200,
      {
        page: parseInt(page),
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos,
        videos,
      },
      "All videos are fetched successfully"
    )
  );
});

const publishVideo = asyncHandler(async (req, res) => {
  // get file in local server
  // validation
  // upload on cloudinary
  // save cloudinary link in database
  // return res

  const { title, description } = req.body;
  if ([title, description].some((field) => field?.trim === "")) {
    throw new apiError(400, "All fields are required");
  }

  let videoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoLocalPath = req.files.videoFile[0].path;
  }

  if (!videoLocalPath) {
    throw new apiError(400, "Video files are required");
  }

  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (!thumbnailLocalPath) {
    throw new apiError(400, "All files are required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  console.log(req.user);

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.secure_url,
    thumbnail: thumbnail.secure_url,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new apiResponse(200, video, "Video uploaded Successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  // get title and description from user
  // validate
  // update
  // return res

  const { title, description } = req.body;
  if (!title && !description) {
    throw new apiError(400, "All fields are required");
  }

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }
  const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const video = await Video.findById(req.params.videoId);
  console.log("video", video);

  if (verifiedUser._id != video.owner) {
    throw new apiError(500, "You don't have permission");
  }

  let thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new apiError(400, "thumbnail file is required");
  }
  const deleteOldThumbnail = await deleteImageFromCloudinary(video.thumbnail);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const updatedVideo = await Video.findByIdAndUpdate(
    req.params.videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.secure_url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedVideo, "Title and Description are updated")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  // const {videoId} = req.params

  const video = await Video.findById(req.params.videoId);
  // console.log("Video", video)
  return res
    .status(200)
    .json(new apiResponse(200, video, "Video fetched successfully"));
});

const getUserVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userVideos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "video",
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
              owner: {
                $first: "$owner",
              },
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "video",
              as: "likes",
            },
          },
          {
            $addFields: {
              totalLikes: { $size: "$likes" },
            },
          },
          {
            $project: {
                likes: 0
            }
          }
        ],
      },
    },

    {
      $project: {
        video: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(200, userVideos, "All videos are fetched successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }
  const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const video = await Video.findById(req.params.videoId);
  console.log("Video", video);

  if (verifiedUser._id != video.owner) {
    throw new apiError(500, "You don't have permission");
  }

  const deletedVideoFromCloudinary = await deleteVideoFromCloudinary(
    video?.videoFile
  );
  const deleteThumbnailFromCloudinary = await deleteImageFromCloudinary(
    video?.thumbnail
  );

  const deletedVideo = await Video.findByIdAndDelete(req.params.videoId);

  return res
    .status(200)
    .json(new apiResponse(200, deletedVideo, "Video deleted successfullly"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    throw new apiError(400, "Video does not exist");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        video,
        `Video is now ${video.isPublished ? "Published" : "Unpublished"}`
      )
    );
});

const getTotalViewsOnVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id; // assuming middleware sets req.user

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid video ID"));
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json(new apiResponse(404, null, "Video not found"));
  }

  // Check if this user already viewed in last 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const alreadyViewed = await View.findOne({
    videoId,
    userId,
    viewedAt: { $gte: sixHoursAgo },
  });

  if (!alreadyViewed) {
    video.views += 1;
    await video.save();

    await View.create({ videoId, userId });
  }

  return res.status(200).json(new apiResponse(200, video, "View tracked"));
});

const toggleVideoInWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid Video ID"));
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Video not found"));
  }

  const user = await User.findById(userId).select("-password -refreshToken");

  const index = user.watchLaterVideos.findIndex(
    (id) => id.toString() === videoId
  );

  let message = "";

  if (index !== -1) {
    // Video exists, remove it
    user.watchLaterVideos.splice(index, 1);
    message = "Video removed from Watch Later";
  } else {
    // Video does not exist, add it
    user.watchLaterVideos.push(videoId);
    message = "Video added to Watch Later";
  }

  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, user.watchLaterVideos, message));
});

const getWatchLaterVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate({
      path: "watchLaterVideos",
      select: "title thumbnail owner", // Include 'owner' for next level populate
      populate: {
        path: "owner",
        select: "fullName avatar username", // Customize as needed
      },
    })
    .select("-password -refreshToken");

  return res.status(200).json(
    new apiResponse(
      200,
      user.watchLaterVideos,
      "Watch Later Videos fetched successfully"
    )
  );
});



const isVideoInWatchLater = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params; // or req.query.playlistId if you prefer

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid Video ID"));
  }

  const user = await User.findById(userId).select("watchLaterVideos"); // minimal fetch

  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const isAdded = user.watchLaterVideos?.some(
    (id) => id.toString() === videoId
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { videoId, isAdded },
        "Watch Later status fetched successfully"
      )
    );
});

export {
  getAllVideo,
  publishVideo,
  updateVideo,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
  getUserVideos,
  getTotalViewsOnVideo,
  toggleVideoInWatchLater,
  getWatchLaterVideos,
  isVideoInWatchLater
};
