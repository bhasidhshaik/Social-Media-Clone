import express from "express"
import { followUnfollowUser, getUserSuggestions, showProfile, updateUserDetails } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()
router.get("/profile/:username" , protectRoute ,showProfile)
router.get("/suggest" , protectRoute ,getUserSuggestions)
router.post("/friendship/:id" ,protectRoute, followUnfollowUser)
router.post("/update" ,protectRoute, updateUserDetails)
export default router