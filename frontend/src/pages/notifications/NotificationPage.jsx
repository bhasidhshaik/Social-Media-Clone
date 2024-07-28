import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart , FaComment } from "react-icons/fa";
import Avatar from '../../dummy/avatars/avatar.jpg'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import toast from "react-hot-toast"

const NotificationPage = () => {
	const queryClient = useQueryClient()
 	const {data:notifications , isLoading} = useQuery({
		queryKey: ["Notifications"],
		queryFn: async()=>{
			const res = await fetch("/api/notification")
			const data = await res.json()
			if(!res.ok){
				throw new Error(data.error)
			}
			return data.notifications
		},
	})
	const {mutate:deleteMutate , isPending:deleting } = useMutation({
		mutationFn : async()=>{
			const res = await fetch("/api/notification" , {
				method: "DELETE",
			})
			const data = await res.json()
			if(!res.ok){
				throw new Error(data.error)
				}
				return data.notifications
		},
		onSuccess: () => {
			toast.success("Notification deleted successfully")
			queryClient.invalidateQueries(["Notifications"])
		}
	})
	const deleteNotifications = (e) => {
		e.preventDefault()
		if(deleting){
			return;
		}
		deleteMutate()
	};

	return (
		<div className="notification-page">
			<div className="notification-header">
				<p className="notification-title">Notifications</p>
				<div className="settings-dropdown">
					<div tabIndex={0} role="button" className="dropdown-button">
						<IoSettingsOutline className="icon" />
					</div>
					<ul className="dropdown-content">
						<li>
							<a onClick={deleteNotifications}>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>
			{notifications?.length === 0 && (
				<div className="no-notifications">No notifications 🤔</div>
			)}
			{notifications?.map((notification) => (
				<div className="notification-item" key={notification._id}>
					<div className="notification-content">
						{notification.type === "follow" && (
							<FaUser className="notification-icon follow-icon" />
						)}
						{notification.type === "like" && (
							<FaHeart className="notification-icon like-icon" />
						)}
						{notification.type === "comment" && (
							<FaComment className="notification-icon like-icon" />
						)}
						<Link to={`/profile/${notification.from.username}`} className="notification-link">
							<div className="notification-avatar">
								<img
									src={notification.from.profileImg || Avatar}
									className="avatar-image"
								/>
							</div>
							<div className="notification-text">
								<span className="username">@{notification.from.username}</span>{" "}
								{notification.type === "follow" && "followed you"}
								{notification.type === "like" && "liked your post"}
								{notification.type === "comment" && "commented on your post"}
							</div>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotificationPage;
