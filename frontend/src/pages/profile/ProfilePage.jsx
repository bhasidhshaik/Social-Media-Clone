import React, { useState } from 'react'
import Avatar from "../../dummy/avatars/avatar.jpg";
import { Link, useParams } from 'react-router-dom';
import Posts from '../../components/posts/Posts';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useFollow from '../../hooks/useFollow';
import SpinnerLoader from '../../components/loaders/SpinnerLoader';

const ProfilePage = () => {
    const {username} = useParams()
   const {follow , isPending} = useFollow()
    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
      });
    const {data:user , isLoading , refetch , isRefetching} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await fetch(`/api/user/profile/${username}`)
            const data = await res.json()
            if(!res.ok){
                throw new Error(data.error)
            }
            return data
        },
        
    })
    const isFollowing = authUser?.following.includes(user?._id)
    useEffect(() => {
		refetch();
	}, [username, refetch , authUser]);
    if(isLoading) return <div>Loading...</div>
    if(!user) return <div>User Not found</div>
    const isMyProfile = authUser?._id === user?._id;
  return (
      <div>
      {!isLoading && user &&(
        <>
        <div className="profile-container">
            <div className="profile-image-container">
                <img className="profile-image" src={ user?.profileImg || Avatar} alt="profile-image" />
            </div>
            <div className="profile-details-container">
                <div className="profile-username">
                    <h4>@{user?.username}</h4>
                </div>
                <div className="profile-count-details">
                    <div className="followers-count">
                        <p>{user?.followers.length} <span>Followers</span></p>
                    </div>
                    <div className="following-count">
                        <p>{user?.following.length} <span>Following</span></p>
                    </div>
                </div>
                <div className="profile-full-name">
                    <span>{user?.fullName}</span>
                    <p>{user?.bio || "I love using Connect Sphere.."}</p>
                </div>
            </div>
        </div>
        {isMyProfile &&   <div className="follow-edit-btn"><Link  className="follow-btn edit-btn" to="/profile/edit">
Update Profile
        </Link>
      </div>}
        {!isMyProfile &&<div className="follow-edit-btn">
            <button onClick={(e)=>{
                e.preventDefault();
                if(isPending){
                    return;
                }
                follow(user?._id)
            }} className="follow-btn">
                {isPending && <SpinnerLoader size={'small'} />}
                {isFollowing && !isPending && "Unfollow" }
                {!isFollowing && !isPending && "Follow" }
            </button>
        </div>
        }
        <div>
            <h3 className='postName'>Posts</h3>
            <Posts feedType={'userPosts'} username={username} />
        </div>
        </>
  )
  }
    </div>
  )
}

export default ProfilePage