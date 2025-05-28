import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

const createTweet = asyncHandler(async(req, res)=>{
    // get tweet from body
    // validation
    // save in database
    // return res
    const {content} = req.body

    if(content?.trim() == ""){
        throw new apiError(400, "All fields are required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    
    return res
    .status(200)
    .json(
        new apiResponse(200, tweet, "Tweet is created successfully")
    )

})

const getUserTweets = asyncHandler(async(req,res)=>{
    const tweet = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.params.userId)
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweet",
            }
        }
    ])
    return res
    .status(200)
    .json(
        new apiResponse(200, tweet[0].tweet,"All tweets are fetched successfully")
    )
})

const deleteTweet = asyncHandler(async(req,res)=>{
    // get tweet by id
    // delete
    // return res
    const tweet = await Tweet.findByIdAndDelete(
        req.params.tweetId,
        {
            $unset: {
                content
            }
        }
    )
    return res
    .status(200)
    .json(
        new apiResponse(200, tweet, "tweet is deleted successfully")
    )
})

const updateTweet = asyncHandler(async(req,res)=>{
    // get data from body
    // validation
    // chect valid user
    // update tweet
    // return res
    const {content} = req.body
    console.log(req.body, req.params)
    if(content?.trim() == ""){
        throw new apiError(400, "All fields are required")
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const tweet = await Tweet.findById(req.params.tweetId)

    if(verifiedUser._id != tweet.owner){
        throw new apiError(500, "You don't have permission")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        req.params.tweetId,
        {
            $set: {
                content: content
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new apiResponse(200,updatedTweet, "Tweet is updated successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    deleteTweet,
    updateTweet
}