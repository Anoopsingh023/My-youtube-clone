import { Router } from "express";
import { 
    getChannelStats,
    getChannelVideo
 } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/stats").get(getChannelStats)
router.route("/videos").get(getChannelVideo)

export default router