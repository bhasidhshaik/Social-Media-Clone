import Post from "./Post";
import {useQuery} from "@tanstack/react-query"
import { useEffect } from "react";
import PostsSkeleton from "../loaders/skeletons/PostsSkeleton";

const Posts = ({feedType , username , setPostsLength}) => {
	const feedTypeCheck = ()=>{
		switch(feedType){
			case "forYou":
				return '/api/post/feed'
			case "following" :
				return '/api/post/following'
			case "userPosts" :
				return `/api/post/user/${username}`
			default :
			return '/api/post/feed'

		}
	}
	const feedEndPoint = feedTypeCheck();
	const {data:posts , isLoading , refetch , isRefetching } = useQuery({
		queryKey : ["posts"],
		queryFn : async() => {
		const res = await fetch(feedEndPoint)
		const data = await res.json()
		if(!res.ok){
			throw new Error(data.error || 'Something went wrong')
		}
		return data.posts
		}
	})
	useEffect(() => {
	  refetch()

	}, [feedType , username])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className="posts-loading">
					<PostsSkeleton />
					<PostsSkeleton />
					<PostsSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p  style={{textAlign : 'center'}} className="no-posts">No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
