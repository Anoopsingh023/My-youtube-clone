import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import {Playlist} from "../models/playlist.model.js"
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"


const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body
    if([name, description].some((field)=>field?.trim==="")){
        throw new apiError(400, "All fields are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
    return res
    .status(200)
    .json(
        new apiResponse(200,playlist,"playlist is created successfully")
    )
})

// const getUserPlaylists = asyncHandler(async (req, res) => {
//     const {userId} = req.params
//     //TODO: get user playlists
//     const playlist = await User.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(req.params.userId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "playlists",
//                 localField: "_id",
//                 foreignField: "owner",
//                 as: "allplaylist"
//             }
//         },
//     ])

//     return res
//     .status(200)
//     .json(
//         new apiResponse(200, playlist[0].allplaylist,"User playlist fetched successfully")
//     )
// })

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid user ID"));
  }

  const playlists = await Playlist.find({ owner: userId }).populate("videos","thumbnail title views");

  return res
    .status(200)
    .json(new apiResponse(200, playlists, "User playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(req.params.playlistId)

    return res
    .status(200)
    .json(
        new apiResponse(200,playlist,"playlist is fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const playlist = await Playlist.findById(req.params.playlistId)
    if(!playlist){
        throw new apiError(400,"Playlist does not exist")
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }

    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(verifiedUser._id != playlist.owner){
        throw new apiError(400, "You don't have access")
    }

    const video = await Video.findById(req.params.videoId)
    if(!video){
        throw new apiError(400, "Video does not exist")
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const alreadyExists = playlist.videos.some(v => v.equals(videoObjectId));
    if (alreadyExists) {
        throw new apiError(400, "Video is already added in playlist");
    }

    playlist.videos.push(videoObjectId);
    await playlist.save();
    
    return res
    .status(200)
    .json(
        new apiResponse(200,playlist,"Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist = await Playlist.findById(req.params.playlistId)
    if(!playlist){
        throw new apiError(400,"Playlist does not exist")
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }

    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(verifiedUser._id != playlist.owner){
        throw new apiError(400, "You don't have access")
    }

    const video = await Video.findById(req.params.videoId)
    if(!video){
        throw new apiError(400, "Video does not exist")
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const alreadyExists = playlist.videos.some(v => v.equals(videoObjectId));
    if (!alreadyExists) {
        throw new apiError(400, "Video does not exist in playlist");
    }

    playlist.videos.pop(videoObjectId);
    await playlist.save();
    
    return res
    .status(200)
    .json(
        new apiResponse(200,playlist,"Video removed from playlist successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.findById(req.params.playlistId)
    if(!playlist){
        throw new apiError(400, "Playlist does not exist")
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }
    
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(verifiedUser._id != playlist.owner){
        throw new apiError(400, "You don't have access")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id)
    return res
    .status(200)
    .json(
        new apiResponse(200, deletedPlaylist,"Playlist is deleted")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    const {name, description} = req.body
    if (!name && !description) {
        throw new apiError(400, "All fields are required");
    }

    const playlist = await Playlist.findById(req.params.playlistId)
    if(!playlist){
        throw new apiError(400,"Playlist does not exist")
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiError(401, "Unauthorized request");
    }
    
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(verifiedUser._id != playlist.owner){
        throw new apiError(400, "You don't have access")
    }

    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.params.playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new apiResponse(200,updatedPlaylist,"Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}