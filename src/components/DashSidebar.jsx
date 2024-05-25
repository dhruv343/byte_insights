import React from 'react'
import { Sidebar } from "flowbite-react"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HiArrowSmRight, HiDocumentText, HiUser, HiUserGroup,HiChartPie } from "react-icons/hi"
import { useDispatch } from "react-redux"
import { signOut } from '../redux/userSlice'
import { useSelector } from 'react-redux'

function DashSidebar() {

    const location = useLocation();
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.user)
    const [tab, setTab] = useState('');
    useEffect(() => {
        const UrlParams = new URLSearchParams(location.search)
        const tabUrl = UrlParams.get('tab');
        setTab(tabUrl);
    }, [location.search])

    return (
        <Sidebar className='w-full md:w-56  border-r-2 border-gray-100'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>

                    {currentUser && currentUser.user.isAdmin && (
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item
                                active={tab === 'dash' || !tab}
                                icon={HiChartPie}
                                as='div'
                            >
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}

                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item icon={HiUser} active={tab === "profile"} label={currentUser.user.isAdmin ? "Admin" : "User"} labelColor="dark">
                            Profile
                        </Sidebar.Item>
                    </Link>



                    {currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=users">
                            <Sidebar.Item icon={HiUserGroup} active={tab === "users"} >
                                Users
                            </Sidebar.Item>
                        </Link>

                    )}


                    {currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item icon={HiDocumentText} active={tab === "posts"} >
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}

                    {currentUser.user.isAdmin && (
                        <Link to="/dashboard?tab=comments">
                            <Sidebar.Item icon={HiUserGroup} active={tab === "comments"} >
                                Comments
                            </Sidebar.Item>
                        </Link>

                    )}

                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
                        <span onClick={() => dispatch(signOut())}>Sign Out</span>
                    </Sidebar.Item>

                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar