import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getAllNotifications = async (req, res) => {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

        const notifications = await Notification.find({ to: userId })
        .populate("from", "fullName profileImg username")
        .sort({ createdAt: -1 });
  
      res.status(200).json({ notifications });
    } catch (error) {
      console.log("Error in getAllNotifications Controller", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  export const deleteAllNotifications = async (req , res)=>{
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
            }
            const notifications = await Notification.deleteMany({ to: userId })
            res.status(200).json({ message: "Notifications deleted" });

        
    } catch (error) {
        console.log("Error in deleteAllNotifications Controller", error.message);
        res.status(500).json({ error: error.message });
        

        
    }

  }
  