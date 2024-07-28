import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (!img && !text) {
      return res.status(400).json({ error: "Please provide text or image" });
    }
    if (img) {
      const uploadedRes = await cloudinary.uploader.upload(img);
      img = uploadedRes.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    res.status(201).json({ newPost });
  } catch (err) {
    console.log("Error in Create post controller", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "You can not delete this post" });
    }
    if (post.img) {
      const image = await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ post: "Post deleted" });
  } catch (err) {
    console.log("Error in Delete post controller", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const likeUnLikePost = async (req, res) => {
  const { id } = req.params;
  let notificationSent = false;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(400).json({ error: "Post not found" });
    if (post.likes.includes(userId)) {
      await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
      const updatedLikes = post.likes.filter((id)=> id.toString() !== userId.toString() );
      return res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await post.save();
      // Send Notification
      if (userId !== post.user.toString() && !notificationSent) {
        const notification = new Notification({
          to: post.user.toString(),
          from: userId,
          type: "like",
        });
        await notification.save();
        notificationSent = true;
      }
      const updatedLikes = post.likes
      return res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in Like post controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const commentOnPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(400).json({ error: "Post not found" });
    if (comment.length < 1) {
      return res.status(401).json({ error: "Please enter comment" });
    }
    const commentObj = {
      text: comment,
      user: req.user._id.toString(),
    };
    post.comments.push(commentObj);
    await post.save();
    if (req.user._id.toString() !== post.user.toString()) {
      const notification = new Notification({
        to: post.user.toString(),
        from: req.user._id,
        type: "comment",
      });
      await notification.save();
    }
    return res.status(200).json({message : "Commented"});
  } catch (error) {
    console.log("Error in Comment post controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id.toString();
  try {
    const post = await Post.findById(postId);
    if (!post){
    return res.status(400).json({ error: "Post not found" });
    }  
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(400).json({ error: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this comment" });
    }
    await Post.updateOne({_id : postId} , {$pull : {comments :{_id : commentId} }})
res.status(200).json({message : "Comment Deleted Successfully"})

  } catch (error) {
    console.log("Error in Delete Comment Controller" , error.message);
    res.status(500).json({ error: error.message });


  }
};
export const getFollowingPosts = async (req , res)=>{
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({error : "User not found" })
    }
    const following = user.following;
    const posts = await Post.find({user : {$in : following}}).populate("user"
      , "fullName profileImg username").populate("comments.user" , "fullName profileImg username").sort({createdAt :
        -1}).limit(10);
        res.status(200).json({posts}) 
  } catch (error) {
    console.log("Error in getFollowingPosts Controller" , error.message);
    res.status(500).json({ error: error.message });
  }
}
export const getFeedPosts = async (req , res)=>{
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({error : "User not found" })
      }
      // Get me posts that not liked and seen by the user
      const posts = await Post.find({
        likes: { $nin: [userId] }
      }).populate("user" , "fullName profileImg username").populate("comments.user" , "fullName profileImg username").sort({createdAt : -1}).limit(10);
      res.status(200).json({posts})
      // Remove those posts which liked by user

  } catch (error) {
    console.log("Error in getFeedPosts Controller" , error.message);
    res.status(500).json({ error: error.message });

    
  }
}
export const getMyPosts = async (req , res)=>{
  const {username} = req.params;
  try {
    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({error : "User not found" })
      }
      const posts = await Post.find({user : user._id}).populate("user" , "fullName profileImg username").populate("comments.user" , "fullName profileImg username").populate("likes.user" , "fullName username profileImg").sort({createdAt : -1});
      res.status(200).json({posts})  
  } catch (error) {
    console.log("Error in getMyPosts Controller" , error.message);
    res.status(500).json({ error: error.message }); 
  }
}