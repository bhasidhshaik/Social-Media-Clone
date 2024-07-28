import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Avatar from "../../dummy/avatars/avatar.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SpinnerLoader from "../../components/loaders/SpinnerLoader";

const CreatePost = () => {
  const queryClient = useQueryClient()
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  // const isPending = false;
  // const isError = false;
const {data:authUser} = useQuery({
  queryKey: ["authUser"]
})
  const {mutate:createPost , isPending , isError , error} = useMutation({
    queryKey: ["createPost"],
    mutationFn : async ({text , img})=>{
      const res = await fetch("/api/post/create" , {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text , img })
        })
        const data = await res.json()
        if(!res.ok){
          throw new Error(data.error)
        }
        return data
    },
    onSuccess : ()=>{
      toast.success("Post Created Successfully")
      queryClient.invalidateQueries(["posts"])
      setText("")
      setImg(null)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isPending){
      return;
    }
    createPost({text , img})
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="post-create">
      <div className="post-container">
        <div className="avatar">
          <div className="avatar-image-profile">
            <img src={ authUser.profileImg || Avatar} />
          </div>
        </div>
        <form className="post-form" onSubmit={handleSubmit}>
          <textarea
            className="post-textarea"
            placeholder="What is happening?!"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {img && (
            <div className="image-preview-container">
              <IoCloseSharp
                className="image-preview-close"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
              />
              <img src={img} className="image-preview" />
            </div>
          )}

          <div className="post-actions">
            <div className="post-icons">
              <CiImageOn
                className="icon"
                onClick={() => imgRef.current.click()}
              />
              <BsEmojiSmileFill className="icon" />
            </div>
            <input type="file" hidden ref={imgRef} onChange={handleImgChange} />
              {isPending &&  <SpinnerLoader size={'small'} /> }
            <button className="post-button">
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
          {isError && <div className="error-message">{error.message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
