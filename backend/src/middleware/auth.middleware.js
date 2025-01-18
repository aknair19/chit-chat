import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }
    //we can get user id from decoded and by using select method we can remove password which is safe way and not expose password
    const user = await User.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res
      .json({
        success: false,
        message: "Internal Server Error",
      })
      .status(500);
  }
};
