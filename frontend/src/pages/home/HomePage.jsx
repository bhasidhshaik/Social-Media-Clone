import React, { useState } from 'react'
import CreatePost from './CreatePost'
import Posts from '../../components/posts/Posts'
const HomePage = () => {
  const [feedType , setFeedType ] = useState('forYou');
  return (
    <div>
      <CreatePost />
      <div className="feedType">
        <div className="forYou ">
          <button onClick={()=>{setFeedType('forYou')}} className= {feedType === 'forYou' ? "feedTypeText underline" : "feedTypeText" } >For You</button>
        </div>
        <div className="following">
          <button onClick={()=>{setFeedType('following')}} className= {feedType === 'following' ? "feedTypeText underline" : "feedTypeText" } >Following</button>
        </div>
      </div>
      <Posts feedType={feedType} />
    </div>
  )
}

export default HomePage