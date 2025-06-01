import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

// TODO: total video views
const getChannelStats = asyncHandler(async(req,res)=>{
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const totalSubscribers = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                }
            }
        },
        {
            $project: {
                subscriberCount: 1,
                channelSubscribedToCount: 1,
            }
        }
    ]) 

    const videos = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "video"
            }
        },
        {
            $addFields: {
                videoCount: {
                    $size: "$video"
                }
            }
        },
        {
            $project: {
                videoCount: 1
            }
        }
    ])

    const likes = await User.aggregate([
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
                as: "like"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$like"
                }
            }
        },
        {
            $project: {
                likesCount: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {totalSubscribers, likes, videos},
            "All stats are fetched successfully"
        )
    )
})

const getChannelVideo = asyncHandler(async(req,res)=>{
    // TODO: Get all the videos uploaded by the channel
    const videos = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
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
                                        username: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            owner: 1,
                            title: 1
                        }
                    }
                ]
            }
        }
    ])

    // console.log(videos[0].video)

    if(!videos?.length){
        throw new apiError(404, "Videos does not exist")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,videos[0].video, "All videos fetched successfully")
    )
})

export {
    getChannelStats,
    getChannelVideo
}