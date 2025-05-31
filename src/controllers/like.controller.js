import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const video = await Video.findById(req.params.videoId)
    const likedBy = await User.findById(req.user._id)


    const alreadyLiked = await Like.find({
        $and: [{video},{likedBy}]
    })

    if(!alreadyLiked?.length){
        const likeVideo = await Like.create({
            video,
            likedBy
        })

        return res
        .status(200)
        .json(
            new apiResponse(200,likeVideo,"Video is liked")
        )
    }

    const unlikeVideo = await Like.findByIdAndDelete(alreadyLiked[0]._id)

    return res
    .status(200)
    .json(
        new apiResponse(200, {unlikeVideo: alreadyLiked}, "video is unliked")
    )
})

// TODO: testing
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const comment = await Comment.findById(req.params.commentId)
    const likedBy = await User.findById(req.user._id)

    const alreadyLiked = await Like.find({
        $and: [{comment},{likedBy}]
    })

    if(!alreadyLiked?.length){
        const likeComment = await Like.create({
            comment,
            likedBy
        })

        return res
        .status(200)
        .json(
            new apiResponse(200,likeComment,"Comment is liked")
        )
    }

    const unlikeComment = await Like.findByIdAndDelete(alreadyLiked[0]._id)

    return res
    .status(200)
    .json(
        new apiResponse(200, {unlikeComment: alreadyLiked}, "Comment is unliked")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const tweet = await Tweet.findById(req.params.tweetId)
    const likedBy = await User.findById(req.user._id)

    const alreadyLiked = await Like.find({
        $and: [{tweet},{likedBy}]
    })

    if(!alreadyLiked?.length){
        const likeTweet = await Like.create({
            tweet,
            likedBy
        })

        return res
        .status(200)
        .json(
            new apiResponse(200,likeTweet,"Tweet is liked")
        )
    }

    const unliketweet = await Like.findByIdAndDelete(alreadyLiked[0]._id)

    return res
    .status(200)
    .json(
        new apiResponse(200, {unliketweet: alreadyLiked}, "tweet is unliked")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedByVideos = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "likedBy",
                            foreignField: "_id",
                            as: "likedBy",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        avatar: 1,
                                        username: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            likedBy: {
                                $first: "$likedBy"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new apiResponse(200, likedByVideos[0].likedVideos,"All liked videos are fetched successfully")
    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}