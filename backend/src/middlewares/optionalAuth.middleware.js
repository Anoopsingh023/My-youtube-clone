// middlewares/optionalAuth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const optionalAuth = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null; // No token → guest
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      req.user = null; // Token decoded but user not found → guest
      return next();
    }

    req.user = user; // Logged-in user
    next();
  } catch (error) {
    req.user = null; // Invalid token → guest
    next();
  }
};
