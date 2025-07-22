import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import {Playlist} from "../models/playlist.model.js"
import { Video } from "../models/video.model.js";
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

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid user ID"));
  }

  const playlists = await Playlist.find({ owner: userId }).populate("videos","thumbnail title views createdAt");

  return res
    .status(200)
    .json(new apiResponse(200, playlists, "User playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(req.params.playlistId).populate("videos","thumbnail title views");

    return res
    .status(200)
    .json(
        new apiResponse(200,playlist,"playlist is fetched successfully")
    )
})

const addVideosToPlaylistByQuery = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const videoIds = req.query.videoIds?.split(",") || [];

  if (!videoIds.length) {
    throw new apiError(400, "No videoIds provided in query");
  }

  // 1. Find playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new apiError(400, "Playlist does not exist");
  }

  // 2. Get and verify token
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "Unauthorized request");
  }

  let verifiedUser;
  try {
    verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new apiError(401, "Invalid or expired token");
  }

  // 3. Ownership check
  if (verifiedUser._id.toString() !== playlist.owner.toString()) {
    throw new apiError(403, "You don't have access to this playlist");
  }

  // 4. Filter valid and non-duplicate videos
  const newVideoIds = [];

  for (const id of videoIds) {
    const video = await Video.findById(id);
    if (video) {
      const videoObjId = new mongoose.Types.ObjectId(id);
      const alreadyExists = playlist.videos.some((v) =>
        v.equals(videoObjId)
      );
      if (!alreadyExists) {
        newVideoIds.push(videoObjId);
      }
    }
  }

  if (!newVideoIds.length) {
    return res.status(400).json(new apiResponse(400, null, "No valid or new videos to add"));
  }

  // 5. Add and save
  playlist.videos.push(...newVideoIds);
  await playlist.save();

  return res.status(200).json(
    new apiResponse(200, playlist, `${newVideoIds.length} video(s) added successfully`)
  );
});

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
    addVideosToPlaylistByQuery,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}