import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const subscriberId = req.user._id;

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId
  });

  if (!existingSubscription) {
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: subscriberId
    });

    return res.status(200).json(
      new apiResponse(200, newSubscription, "Channel is subscribed")
    );
  }

  await Subscription.deleteOne({ _id: existingSubscription._id });

  return res.status(200).json(
    new apiResponse(200, null, "Channel is unsubscribed")
  );
});


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
                    },
                    {
                        $addFields: {
                            channel: {
                                $first: "$channel"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                fullName: 1,
                avatar: 1,
                username: 1,
                subscribedChannel: 1,
                channel: 1
            }
        }
    ])
    // console.log("Channel",subscribedChannels[0].subscribedChannel.channel)
    return res
    .status(200)
    .json(
        new apiResponse(200,subscribedChannels, "Subscribed channel is fetched successfully")
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
                as: "subscribers",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "subscriber",
                            foreignField: "_id",
                            as: "subscriber",
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
                            subscriber: {
                                $first: "$subscriber"
                            }
                        }
                    }
                ]
            }
        },
        
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                subscribers: 1,
                subscriber: 1
            }
        }
    ])
    // console.log("Channel",subscribers)

    return res
    .status(200)
    .json(
        new apiResponse(200, subscribers, "Subscribers are fetched successfully")
    )
    
})


export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers,
}