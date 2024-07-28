import React from "react";
import Avatar from "../../dummy/avatars/avatar.jpg"
import {  useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import SpinnerLoader from "../loaders/SpinnerLoader";
import UserSuggestion from "../loaders/skeletons/UserSuggestion";
const SuggestionsBar = () => {
 const {data:suggestedUsers , isLoading } = useQuery({
  queryKey: ["suggestedUsers"],
  queryFn: async () => {
    const res = await fetch("/api/user/suggest")
    const data = await res.json()
    if(!res.ok){
      throw new Error(data.error)
    }
    return data
  }

 })
 const {follow , isPending} = useFollow()
  return (
    <div className="suggestionsBar">
      <div className="suggestionsBarTitle">
        <h2>Suggestions for you</h2>
      </div>
      {isLoading && <div>
        <UserSuggestion />
        <UserSuggestion />
        <UserSuggestion />
        <UserSuggestion />
        </div> }
      {suggestedUsers?.length === 0 && <div>No suggestions found</div>}
      { !isLoading && (
      <div className="suggestionsBarContent">
        {suggestedUsers.map((user, index) => {
          return (
            <div className="suggestionsBarContentItem" key={index}>
              <Link to= {`/profile/${user.username}`} >
              <div className="suggestionsBarUser">
                <div className="suggestionsBarContentItemImage">
                    {/* <img src={avatar1} alt="avatar" /> */}
                  <img src={user.profileImg || Avatar } alt={user.fullName} />
                </div>
                <div className="suggestionsBarContentItemTitle">
                  <p>{user.fullName}</p>
                  <p className="username"> @ {user.username}</p>
                </div>
              </div>
              </Link>
              <div className="suggestionsBarContentItemFollow">
                <span onClick={(e)=>{
                  e.preventDefault()
                  follow(user._id)

                }} >
                  {isPending ? <SpinnerLoader size={'small'} />: "Follow"}
                </span>
              </div>
            </div>
          );
        })}
      </div>)
      }
    </div>
  );
};

export default SuggestionsBar;
