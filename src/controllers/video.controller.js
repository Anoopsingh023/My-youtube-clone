import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import {
    deleteImageFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const getAllVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    // get all video based of query
    // sort them

    const skip = (page - 1) * limit;
    const sortOption = { [sortBy]: sortType === 'asc' ? 1 : -1 };

    const filter = {};

    // Text search
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }

    // User filter
    if (userId) {
        filter.user = userId;
    }

    const totalVideos = await Video.countDocuments(filter);
    const videos = await Video.find(filter)
        .sort(sortOption)
        .skip(parseInt(skip))
        .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        page: parseInt(page),
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos,
        videos,
    });

});

const publishVideo = asyncHandler(async (req, res) => {
    // get file in local server
    // validation
    // upload on cloudinary
    // save cloudinary link in database
    // return res

    // console.log("Body",req.body)
    const { title, description } = req.body;
    if ([title, description].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }

    let videoLocalPath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoLocalPath = req.files.videoFile[0].path;
    }

    if (!videoLocalPath) {
        throw new apiError(400, "Video files are required");
    }

    let thumbnailLocalPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if (!thumbnailLocalPath) {
        throw new apiError(400, "All files are required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    // console.log(req.user)

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
    });

    return res.status(200).json(new apiResponse(200, video, "Successfull"));
});
// TASK
// thumbnail update remains
// delete controller
const updateVideo = asyncHandler(async (req, res) => {
    // get title and description from user
    // validate
    // update
    // return res

    // console.log("Body", req.body);
    // console.log("params", req.params)
    const { title, description } = req.body;
    if (!title && !description) {
        throw new apiError(400, "All fields are required");
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const video = await Video.findById(req.params.videoId);

    if (verifiedUser._id != video.owner) {
        throw new apiError(500, "You don't have permission");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        req.params.videoId,
        {
            $set: {
                title,
                description,
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

// const updateThumbnail = asyncHandler(async(req,res)=>{
//     const thumbnailLocalPath = req.file?.path
//     if(!thumbnailLocalPath){
//         throw new apiError(400, "Thumbnail file is required")
//     }
//     const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//         throw new apiError(401, "Unauthorized request");
//     }
//     const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const video = await Video.findById(req.params.videoId);

//     if (verifiedUser._id != video.owner) {
//         throw new apiError(500, "You don't have permission");
//     }

//     const deleteOldThumbnail = await deleteImageFromCloudinary(thumbnail)
//     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

//     const updateThumbnail = await Video.findByIdAndUpdate(
//         req.params.videoId,
//         {
//             $set: {
//                 thumbnail: thumbnail.url
//             }
//         },
//         {set: true}
//     )

//     return res
//     .status(200)
//     .json(
//         new apiResponse(200, updateThumbnail, "Thumbnail updated successfully")
//     )
// })

const getVideoById = asyncHandler(async(req,res)=>{
    // const {videoId} = req.params

    const video = await Video.findById(req.params.videoId)
    // console.log("Video", video)
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    )
})

const deleteVideo = asyncHandler(async(req,res)=>{

})

const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const video = await Video.findById(req.params.videoId)
    if(!video){
        throw new apiError(400, "Video does not exist")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            video,
            `Video is now ${video.isPublished? "Published": "Unpublished"}`,
        )
    )
})

export {
    getAllVideo,
    publishVideo,
    updateVideo,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    // updateThumbnail
};
