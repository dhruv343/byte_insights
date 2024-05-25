import { Button, Table,Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashPosts() {
    const { currentUser } = useSelector((state) => state.user)
    const [userPosts, setPosts] = useState([])
    const [showMore, setShowMore] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete,setPostIdToDelete]=useState('')
    const [postDeleted,setPostDeleted]=useState(false);

    useEffect(() => {

        const getPosts = async () => {
            let result = await fetch(`http://localhost:3500/api/create/getPosts?userId=${currentUser.user._id}`, {
                method: 'get',
                headers: {
                    'Content-Type': "application/json",
                }
            })
            const data = await result.json();
            if (result.ok) {
                setPosts(data.posts)
                if (data.posts.length == 9) {
                    setShowMore(true)
                }
            }
        }

        if (currentUser.user.isAdmin) {
            getPosts();
        }

    }, [currentUser.user._id,postDeleted])

    const handleShowMore = async () => {
        const startIndex = userPosts.length

        let result = await fetch(`http://localhost:3500/api/create/getPosts?startIndex=${startIndex}&userId=${currentUser.user._id}`, {
            method: 'get',
            headers: {
                'Content-Type': "application/json",
            }
        })
        const data = await result.json();
        if (result.ok) {
            setPosts((prev) => [...prev, ...data.posts])
            if (data.posts.length == 9) {
                setShowMore(true)
            }
        }

    }

    const handleDeletePost=async()=>{
        setShowModal(false)
        try {
            let result = await fetch(`http://localhost:3500/api/create/delete/${postIdToDelete}/${currentUser.user._id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': "application/json"
                    ,"authorization": currentUser.auth
                }
            })

            const data=await result.json()
            if(!result.ok){
                console.log(data.message)
            }
            else{
            setPostDeleted(true)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    console.log(userPosts);
    return (
        <div className=' table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300'>
            {currentUser.user.isAdmin && userPosts.length > 0 ? <>
                <Table hoverable className='shadow-md'>
                    <Table.Head>
                        <Table.HeadCell>Date Updated</Table.HeadCell>
                        <Table.HeadCell>Post image</Table.HeadCell>
                        <Table.HeadCell>Post title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                        <Table.HeadCell>Edit</Table.HeadCell>
                    </Table.Head>
                    {userPosts.map((post) => (
                        <Table.Body className='divide-y' key={post._id}>
                            <Table.Row className='bg-white '>
                                <Table.Cell>
                                    {new Date(post.updatedAt).toLocaleDateString()}
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={`/post/${post.slug}`}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className='w-20 h-10 object-cover bg-gray-500'
                                        />
                                    </Link>
                                </Table.Cell>
                                <Table.Cell>
                                    <Link
                                        className='font-medium text-gray-900 dark:text-white'
                                        to={`/post/${post.slug}`}
                                    >
                                        {post.title}
                                    </Link>
                                </Table.Cell>
                                <Table.Cell>{post.category}</Table.Cell>

                                <Table.Cell>
                                    <span
                                        className='font-medium text-red-500 hover:underline cursor-pointer'
                                        
                                        onClick={()=>{
                                            setShowModal(true);
                                            setPostIdToDelete(post._id)
                                            }}
                                    >
                                        Delete
                                    </span>
                                </Table.Cell>

                                <Table.Cell>
                                    <Link
                                        className='text-teal-500 hover:underline'
                                        to={`/update-post/${post._id}`}
                                    >
                                        <span>Edit</span>
                                    </Link>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>

            </> : <p>No posts found</p>}
            {showMore && <button onClick={handleShowMore} className='w-full py-5 text-teal-500 self-center'>Show More</button>}

            {showModal && <Modal show={showModal} onClose={() => { setShowModal(false) }} popup>

                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete the post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>}
        </div>

        
    )
}

export default DashPosts