import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registrUser 
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

export default router

