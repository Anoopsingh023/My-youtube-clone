import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken";
import { Like } from "../models/like.model.js";


const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const filter = videoId ? { video: videoId } : {};

  const totalComment = await Comment.countDocuments(filter);

  const comments = await Comment.find(filter)
    .populate("owner", "username avatar fullName")
    .lean()
    .skip(parseInt(skip))
    .limit(parseInt(limit));

  const commentIds = comments.map((c) => c._id);

  // Get all likes for these comments
  const likes = await Like.find({
    comment: { $in: commentIds },
  }).select("comment likedBy");

  const likeCountMap = {};
  const likedByMap = {}; // Stores an array of userIds for each comment

  likes.forEach((like) => {
    const commentId = like.comment.toString();
    const likedBy = like.likedBy.toString();

    // Count likes
    likeCountMap[commentId] = (likeCountMap[commentId] || 0) + 1;

    // Store likedBy list
    if (!likedByMap[commentId]) {
      likedByMap[commentId] = [];
    }
    likedByMap[commentId].push(likedBy);
  });

  const userId = req.user ? req.user._id.toString() : null;

  const enrichedComments = comments.map((comment) => {
    const id = comment._id.toString();
    return {
      ...comment,
      likeCount: likeCountMap[id] || 0,
      isLiked: userId ? likedByMap[id]?.includes(userId) || false : false,
    };
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        enrichedComments,
        page: parseInt(page),
        totalPages: Math.ceil(totalComment / limit),
        totalComment,
      },
      "All comments are fetched"
    )
  );
});


const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  const video = await Video.findById(req.params.videoId);
  if (!video) {
    throw new apiError(400, "Video does not exist");
  }

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    video: video._id,
  });

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment is created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;

  const { content } = req.body;
  if (!content?.trim()) {
    throw new apiError(400, "All fields are required");
  }

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new apiError(401, "Commnet is not available");
  }

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }
  const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (verifiedUser._id != comment?.owner) {
    throw new apiError(400, "You don't have permission");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    comment?._id,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedComment, "Comment is updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    throw new apiError(401, "Commnet is not available");
  }

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }
  const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (verifiedUser._id != comment?.owner) {
    throw new apiError(400, "You don't have permission");
  }

  const deletedComment = await Comment.findByIdAndDelete(comment._id);

  return res
    .status(200)
    .json(new apiResponse(200, deletedComment, "Comment is deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
