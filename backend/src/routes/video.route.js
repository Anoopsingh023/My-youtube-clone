import { Router } from "express";
import { getAllVideo, 
    publishVideo, 
    updateVideo,
    getVideoById,
    togglePublishStatus,
    deleteVideo,
    getUserVideos,
    getTotalViewsOnVideo
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").get(getAllVideo)
router.use(verifyJWT)
router.route("/views/:videoId").put(getTotalViewsOnVideo)


router.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishVideo
)


router.route("/:videoId").patch(upload.single("thumbnail"),updateVideo).get(getVideoById).delete(deleteVideo)
router.route("/toggle/publish/:videoId").patch(togglePublishStatus)
router.route("/u/:userId").get(getUserVideos)



export default router