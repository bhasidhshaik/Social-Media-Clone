import React from 'react'
import { MdHome } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import LogoWhite from "../../assets/logo-white.png"

import { Link } from 'react-router-dom'
import { useMutation, useQueryClient , useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SideBar = () => {
  const queryClient = useQueryClient()
  const {data:authUser} = useQuery({queryKey : ["authUser"]})
  const {mutate , isPending , isError , error} = useMutation({
    mutationKey : ["logOut"],
    mutationFn: async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
          })
          },
          onSuccess:()=>{
            toast.success("Logout Successfull")
            queryClient.invalidateQueries(['authUser'])
            window.location.reload()
          }
  })
  return (
    <div className='sideBar'>
      <div className="sideBarTop">
      <div className="sidebarLogo">
        <img src={LogoWhite} alt="Logo" />
      </div>
        <div className="sideBarItems">
          <ul className="sideBarList">
            <li className="sideBarItem">
              <Link className='sideBarItemLink' to = '/'>
              <MdHome className="sideBarItemIcon" size={37} />
              <span className="sideBarItemText">Home</span>
              </Link>
            </li>
            <li className="sideBarItem">
              <Link className='sideBarItemLink' to = '/search'>
              <IoSearch className="sideBarItemIcon" size={37}/>
              <span className="sideBarItemText">Search</span>
              </Link>
            </li>
            <li className="sideBarItem">
              <Link className='sideBarItemLink' to = '/notifications'>
              <IoMdNotifications className="sideBarItemIcon" size={37}/>
              <span className="sideBarItemText">Notifications</span>
              </Link>
            </li>
            <li className="sideBarItem">
              <Link className='sideBarItemLink' to = '/messages'>
              <AiFillMessage className="sideBarItemIcon" size={37}/>
              <span className="sideBarItemText">Messages</span>
              </Link>
            </li>
            <li className="sideBarItem">
              <Link className='sideBarItemLink' to = {`/profile/${authUser.username}`}>
              <FaCircleUser className="sideBarItemIcon" size={35}/>
              <span className="sideBarItemText">Profile</span>
              </Link>
            </li>
          </ul>
        </div>
        </div>
        <div className="sideBarBottom">
        <div className="sideBarLogout">
        <Link className='sideBarItemLink' to = '/logout' onClick={(e)=>{
          e.preventDefault()
          mutate();
        }}>
              <span className="sideBarItemText">Logout</span>
              <FiLogOut className="sideBarItemIcon logoutBtn" size={37} />
              </Link>
        </div>
        </div>
    </div>
  )
}

export default SideBar