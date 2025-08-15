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
  addToWatchHistory,
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
  getUserById,
  togglePlaylistInWatchLater,
  getWatchLaterPlaylists,
  isPlaylistInWatchLater,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {optionalAuth} from "../middlewares/optionalAuth.middleware.js"

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registrUser
);

router.route("/login").post(loginUser);

// Secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPasswaord);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetail);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(optionalAuth, userChannelProfile);
router.route("/u/:userId").get(verifyJWT, getUserById);

router
  .route("/history")
  .get(verifyJWT, getWatchHistory)
  .delete(verifyJWT, clearWatchHistory);
router
  .route("/history/:videoId")
  .post(verifyJWT, addToWatchHistory)
  .delete(verifyJWT, removeFromWatchHistory);

router
  .route("/playlist/:playlistId")
  .post(verifyJWT, togglePlaylistInWatchLater)
  .get(verifyJWT, isPlaylistInWatchLater);

router
  .route("/watch-later")
  .get(verifyJWT, getWatchLaterPlaylists)

export default router;
