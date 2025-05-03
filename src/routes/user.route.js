import { Router } from "express";
import { 
    login, 
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
router.route("/logoutUser").post(verifyJWT, logoutUser)

export default router

