import { Router } from 'express';
import {
    addVideosToPlaylistByQuery,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {optionalAuth} from "../middlewares/optionalAuth.middleware.js"

const router = Router();

router.route("/user/:userId").get(optionalAuth, getUserPlaylists);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createPlaylist)

router
    .route("/user/p/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:playlistId/add-videos").post(addVideosToPlaylistByQuery);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);


export default router