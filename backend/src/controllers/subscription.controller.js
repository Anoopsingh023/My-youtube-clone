import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


const toggleSubscription = asyncHandler(async(req,res)=>{

    const channel = await User.findById(req.params.channelId)
    const subscriber = await User.findById(req.user._id)

    const channelExist = await Subscription.find({
        $and: [{channel},{subscriber}]
    })

    if(!channelExist?.length){ 
        const subscription = await Subscription.create({
            channel,
            subscriber
        })
        
        return res
        .status(200)
        .json(
            new apiResponse(200,subscription, "Channel is subscribed")
        )
    }

    const unSubscribe = await Subscription.deleteOne(channelExist._id)

    return res
    .status(200)
    .json(
        new apiResponse(200, {unSubscribe: channelExist},"Channel is unsubscribed")
    )
})

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params
    const subscribedChannels = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.params.subscriberId)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedChannel",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "channel",
                            foreignField: "_id",
                            as: "channel",
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
                    }
                ]
            }
        },
        {
            $addFields: {
                subscribedChannel: {
                    $first: "$subscribedChannel"
                }
            }
        },
        {
            $project: {
                subscribedChannel: 1
            }
        }
    ])
    // console.log("Channel",subscribedChannels[0].subscribedChannel.channel)
    return res
    .status(200)
    .json(
        new apiResponse(200,subscribedChannels[0].subscribedChannel.channel, "Subscribed channel is fetched successfully")
    )
})

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.params
    const subscribers = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.params.channelId)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "user",
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
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscriber"
                }
            }
        },
        {
            $project: {
                subscriber: 1
            }
        }
    ])
    console.log("Channel",subscribers[0].subscriber.user)

    return res
    .status(200)
    .json(
        new apiResponse(200, subscribers[0].subscriber.user, "Subscribers are fetched successfully")
    )
    
})


export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers,
}