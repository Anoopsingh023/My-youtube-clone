import { Router } from "express";
import { 
    registrUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPasswaord,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateCoverImage,
    userChannelProfile,
    getWatchHistory 
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    registrUser)
    
router.route("/login").post(loginUser)

// Secure route
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPasswaord)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-account").post(verifyJWT,updateAccountDetail)
router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").post(verifyJWT, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").post(verifyJWT,userChannelProfile)
router.route("/history").post(verifyJWT,getWatchHistory)


export default router