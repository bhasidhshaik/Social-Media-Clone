import React from 'react'
import "./styles/styles.css"

const PostsSkeleton = () => {
  return (
    <div className="card">
  <div className="card__skeleton card__title"></div>
  <div className="card__skeleton card__description">         </div>
</div>
  )
}

export default PostsSkeleton