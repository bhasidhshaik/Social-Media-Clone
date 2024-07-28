import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";


export const showProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in Show profile ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const currentUser = req.user;
    if(req.user._id.toString() === id){
      return res.status(400).json({error: "You can't follow yourself."})

    }
    if (currentUser.following.includes(id)) {
      await currentUser.updateOne({ $pull: { following: id } });
      await user.updateOne({ $pull: { followers: currentUser._id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await currentUser.updateOne({ $push: { following: id } });
      await user.updateOne({ $push: { followers: currentUser._id } });
      // Send to Notification
      const newNotification = new Notification( {
        from : currentUser._id,
        to : user._id,
        type : "follow",
      })
      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in Follow Unfollow User ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const following = user.following;
    const followers = user.followers;
    const users = await User.find({
      _id: { $nin: [...following, ...followers , userId] },
    }).limit(5).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in User Suggestions ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserDetails = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword , link , bio } = req.body;
  let { profileImg } = req.body;
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (
      (!currentPassword && newPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res
        .status(401)
        .json({ error: "Please provide current password and new password" });
    }
    if (currentPassword && newPassword) {
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }
    if(profileImg){
      if(user.profileImg){
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
      }
      const uploadedRes = await cloudinary.uploader.upload(profileImg)
      profileImg = uploadedRes.secure_url
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.link = link || user.link;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg
 
    user = await user.save();
    user.password = null;
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in User Details Update ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
