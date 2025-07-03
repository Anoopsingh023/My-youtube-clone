import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    totalLikesOnVideo,
    isVideoLiked,
    
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/:videoId").get(totalLikesOnVideo)
router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file

// router.route("")
router.route("/toggle/v/:videoId").post(toggleVideoLike).get(isVideoLiked);
router.route("/toggle/c/:commentId").post(toggleCommentLike)
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);



export default router