import mongoose, { isValidObjectId,Types } from "mongoose";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  //TODO: toggle like on video
  const likedById = req.user._id;
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    throw new apiError(400, "Video is not available");
  }

  const alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: likedById,
  });

  if (!alreadyLiked) {
    const likeVideo = await Like.create({
      video: videoId,
      likedBy: likedById,
    });

    return res
      .status(200)
      .json(new apiResponse(200, likeVideo, "Video is liked"));
  }

  const unlikeVideo = await Like.deleteOne({ _id: alreadyLiked._id });

  return res.status(200).json(new apiResponse(200, null, "video is unliked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const likedById = req.user._id;

  //TODO: toggle like on comment
  const comment = await Comment.findById(req.params.commentId);
  const likedBy = await User.findById(req.user._id);

  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: likedById,
  });

  if (!alreadyLiked) {
    const likeComment = await Like.create({
      comment: commentId,
      likedBy: likedById,
    });

    return res
      .status(200)
      .json(new apiResponse(200, likeComment, "Comment is liked"));
  }

  const unlikeComment = await Like.deleteOne({ _id: alreadyLiked._id });

  return res.status(200).json(new apiResponse(200, null, "Comment is unliked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params.tweetId;
  //TODO: toggle like on tweet
  const tweet = await Tweet.findById(req.params.tweetId);
  const likedBy = await User.findById(req.user._id);

  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: likedBy._id,
  });

  if (!alreadyLiked) {
    const likeTweet = await Like.create({
      tweet: tweetId,
      likedBy: likedBy._id,
    });

    return res
      .status(200)
      .json(new apiResponse(200, likeTweet, "Tweet is liked"));
  }

  const unliketweet = await Like.deleteOne({ _id: alreadyLiked._id });

  return res.status(200).json(new apiResponse(200, null, "tweet is unliked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const page  = Number.parseInt(req.query.page, 10)  || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;

  const userIdRaw = req.user?._id;

  // 1) Validate early
  if (!isValidObjectId(userIdRaw)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid user ID"));
  }

  // 2) **Always** convert to hex string first, then create a fresh ObjectId
  const userId = new Types.ObjectId(userIdRaw.toString());

  // 1️⃣ Total Count
  const totalLikedVideoResult = await Like.aggregate([
    { $match: { likedBy: userId, video: { $ne: null } } },
    { $count: "total" },
  ]);
  const totalLikedVideos = totalLikedVideoResult[0]?.total || 0;

  // 2️⃣ Paginated fetch
  const likedVideos = await Like.aggregate([
    { $match: { likedBy: userId, video: { $ne: null } } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              owner: 1,
            },
          },
          {
          $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                { $project: { fullName: 1, avatar: 1, username: 1 } },
              ],
            },
          },
          { $unwind: "$owner" },
        ],
      },
    },
    { $unwind: "$video" },
    {
      $project: {
        likedAt: "$createdAt",
        video: 1,
      },
    },
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalLikedVideos,
        currentPage: page,
        totalPages: Math.ceil(totalLikedVideos / limit),
        likedVideos,
      },
      "Liked videos fetched successfully"
    )
  );
});


const totalLikesOnVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid video ID"));
  }

  const totalLikes = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "like",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$like",
        },
      },
    },
    {
      $project: {
        likesCount: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, totalLikes, "All likes are fetched"));
});

const isVideoLiked = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json(400, "Invalid video ID");
  }

  const isLiked = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.videoId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "like",
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: {
            if: { $in: [req.user._id, "$like.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        isLiked: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, isLiked[0], "Video like is fetched"));
});



export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  totalLikesOnVideo,
  isVideoLiked,
  
};
