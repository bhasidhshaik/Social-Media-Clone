import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteAllNotifications, getAllNotifications } from "../controllers/notification.controller.js";


const router = express.Router()
router.get("/" , protectRoute , getAllNotifications)
router.delete("/" , protectRoute , deleteAllNotifications)

export default router