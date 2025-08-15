import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';

const router = Router();

router.route("/v/:videoId").get(optionalAuth,getVideoComments)
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/v/:videoId").post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router