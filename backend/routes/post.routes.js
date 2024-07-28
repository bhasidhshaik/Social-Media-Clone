import express from "express"
import { commentOnPost, createPost, deleteComment, deletePost, getFeedPosts, getFollowingPosts, getMyPosts, likeUnLikePost } from "../controllers/post.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()
router.get("/following" , protectRoute , getFollowingPosts)
router.get("/feed" , protectRoute , getFeedPosts)
router.get("/user/:username" , protectRoute , getMyPosts)

router.post("/create" , protectRoute, createPost)
router.post("/like/:id" , protectRoute, likeUnLikePost)
router.post("/comment/:id" , protectRoute, commentOnPost)

router.delete("/:id" , protectRoute, deletePost)
router.delete("/comment/:postId/:commentId" , protectRoute, deleteComment)

export default router 