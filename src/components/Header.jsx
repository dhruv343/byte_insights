import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai"
import { FaMoon } from "react-icons/fa"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { signOut } from '../redux/userSlice';

function Header() {

    let location = useLocation()
    const { theme } = useSelector((state) => state.theme)
    let path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState("")
    const navigate=useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
        // console.log(urlParams)
        
    }, [location.search])

    console.log(searchTerm)

    const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm",searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    }



    const logout = () => {
        dispatch(signOut())
    }

    return (
        <Navbar className='border-b-2'>

            <Link to='/' className='self-center whitespace-nowrap text-lg ml-5 sm:text-xl font-semibold'>
                <span className='px-2 italic mr-1 py-1 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-500 rounded-md shadow-md text-white font-extrabold'>Byte</span>
                <span className='font-extrabold italic'>Insights</span>
            </Link>

            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search'
                    rightIcon={AiOutlineSearch}

                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <Button onClick={()=>{navigate("/search")}} color='gray' className='w-12 h-15 lg:hidden'>
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden ' onClick={() => dispatch(toggleTheme())} color='gray'><FaMoon /></Button>
                {
                    currentUser && currentUser.user ? (<>
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user"
                                    img={currentUser.user.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <>
                                    <span className='block'>@{currentUser.user.username}</span>
                                    <span className='block font-bold'>{currentUser.user.email}</span>
                                </>

                            </Dropdown.Header>

                            <Link to='/dashboard?tab=profile'>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
                        </Dropdown>
                    </>) : <Link to='/signin'><Button gradientDuoTone="purpleToBlue" outline>Sign In</Button></Link>
                }

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/news"} as={'div'}>
                    <Link to='/news'>Tech-News</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
            </Navbar.Collapse>

        </Navbar>
    )
}

export default Header