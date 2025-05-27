import { Router } from "express";
import { getAllVideo, 
    publishVideo, 
    updateVideo,
    getVideoById,
    togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

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
router.route("/").get(getAllVideo)
router.route("/:videoId").patch(updateVideo).get(getVideoById)
router.route("/toggle/publish/:videoId").patch(togglePublishStatus)



export default router