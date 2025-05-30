import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { apiError } from "./apiError.js";
import { extractPublicId } from 'cloudinary-build-url'

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, 
        {
            resource_type: "auto",
        }
    );
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  }
    catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

// Delete old image from cloudinary
const deleteImageFromCloudinary = async(fileUrl) =>{
  try {
    const publicId = extractPublicId(fileUrl) 
    const deleteResponse = await cloudinary.uploader.destroy(publicId, {invalidate: true})
  } catch (error) {
    throw new apiError(400, error?.message || "unable to delete image")
  }
}

const deleteVideoFromCloudinary = async(fileUrl) =>{
  try {
    const publicId = extractPublicId(fileUrl) 
    const deleteResponse = await cloudinary.uploader.destroy(publicId,{resource_type: "video"})
  } catch (error) {
    throw new apiError(400, error?.message || "unable to delete image")
  }
}

export {uploadOnCloudinary, deleteImageFromCloudinary, deleteVideoFromCloudinary}