import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../dummy/avatars/avatar.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SpinnerLoader from "../loaders/SpinnerLoader";
import { formatTimeAgo } from "../../utils/date";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const postOwner = post.user;
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    queryKey: ["deletePost", post._id],
    mutationFn: async () => {
      const res = await fetch(`/api/post/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Post Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    queryKey: ["likePost"],
    mutationFn: async () => {
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"] , (oldData)=>{
        return oldData.map((p) => {
          if (p._id === post._id) {
            return {...post, likes: updatedLikes}
            }
            return p;
            })

      })
    },
    onError : (error)=>{
      toast.error(error.message)
    }
  });
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn : async()=>{
      const res = await fetch( `/api/post/comment/${post._id}`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({comment}),
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
        }
        return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      })

            },
            onError : (error)=>{
              toast.error(error.message)
              }
  })
  const isLiked = post.likes.includes(authUser?._id);

  const isMyPost = authUser?._id === postOwner?._id;

  const formattedDate = formatTimeAgo(post.createdAt);


  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if(isCommenting){
      return;
    }
    commentPost();
  };

  const handleLikePost = (e) => {
    e.preventDefault();
    if(isLikingPost){
      return;
    }
    likePost(post._id);

  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <>
      <div className="post-container">
        <div className="post-avatar">
          <Link to={`/profile/${postOwner?.username}`}>
            <img
              src={postOwner?.profileImg || Avatar}
              className="avatar-image"
            />
          </Link>
        </div>
        <div className="post-content">
          <div className="post-header">
            <Link
              to={`/profile/${postOwner?.username}`}
              className="post-username"
            >
              {postOwner?.fullName}
            </Link>
            <span className="post-meta">
              <Link className="post-user" to={`/profile/${postOwner?.username}`}>
                @{postOwner?.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span>
                {" "}
                {!isDeletingPost && (
                  <FaTrash
                    className="post-delete-icon"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeletingPost && <SpinnerLoader size={"small"} />}
              </span>
            )}
          </div>
          <div className="post-body">
            <span>{post.text}</span>
            {post.img && <img src={post?.img} className="post-image" alt="" />}
          </div>
          <div className="post-actions">
           
            <div className="post-action" onClick={handleLikePost}>
              {isLikingPost && <SpinnerLoader size={'small'} /> }
             {!isLikingPost && (<><FaRegHeart
                className={`post-action-icon ${isLiked ? "liked" : ""}`}
              />
              <span className={`${isLiked ? "liked" : ""}`}>
                {post?.likes.length}
              </span></>)} 
              
            </div>
            <div className="post-action" onClick={toggleComments}>
              <FaRegComment className="post-action-icon" />
              <span>{post?.comments.length}</span>
            </div>
            <FaRegBookmark className="post-bookmark-icon" />
          </div>
          {showComments && (
            <div className="post-comments">
              <div className="comments-header">
                <h3>COMMENTS</h3>
                <span className="close-comments" onClick={toggleComments}>
                  Close
                </span>
              </div>
              <div className="comments-list">
                {post?.comments.length === 0 && (
                  <p>No comments yet 🤔 Be the first one 😉</p>
                )}
                {post?.comments.map((comment) => (
                  <div key={comment?._id} className="comment">
                    <img
                      src={comment?.user.profileImg || Avatar}
                      className="comment-avatar"
                    />
                    <div className="comment-content">
                      <span className="comment-username">
                        {comment?.user.fullName}
                      </span>
                      <span className="comment-meta">
                        @{comment?.user.username}
                      </span>
                      <div>{comment?.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form className="comment-form" onSubmit={handlePostComment}>
                <textarea
                  className="comment-input"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="comment-submit-btn">
                  {isCommenting ? "Posting..." : "Post"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Post;
