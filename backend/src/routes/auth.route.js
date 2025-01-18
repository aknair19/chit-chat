import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

//protect route by checking is the user is logged in
router.put("/update-profile", protectRoute, updateProfile);
//to authenticate between every routes in UI if the user is authenticated or not
router.get("/check", protectRoute, checkAuth);

export default router;
