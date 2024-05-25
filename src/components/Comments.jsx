import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Comm from './Comm'

function Comments({ postId }) {

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const getComm = async () => {
      try {
        const result = await fetch(`http://localhost:3500/api/comment/getAllComments/${postId}`)
        const data = await result.json()
        setComments(data)
      } catch (error) {
        console.log(error.message)
      }

    }
    getComm()

  }, [postId, comment])


  const handleComment = async (e) => {

    e.preventDefault()
    try {
      setError(null)
      if (comment == "") {
        setError("Please enter any comment first")
        return
      }
      const result = await fetch("http://localhost:3500/api/comment/addcomment", {
        method: 'post',
        body: JSON.stringify({ content: comment, postId: postId, userId: currentUser.user._id }),
        headers: {
          'Content-Type': "application/json",
          "authorization": currentUser.auth
        }
      })
      let data = await result.json()
      if (!result.ok) {
        setError(data.message);
      }
      else {
        setComment("")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      const res = await fetch(`http://localhost:3500/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': "application/json",
          "authorization": currentUser.auth
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
              : comment
          )
        );
      }

    }
    catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  const handleDelete = async (commentId) => {

    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`http://localhost:3500/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': "application/json",
          "authorization": currentUser.auth
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='max-w-2xl mx-auto p-2 w-full mt-5'>

      {currentUser ?

        <div className='flex gap-1 text-sm items-center'>Signed in as:{<img src={currentUser.user.profilePicture} alt="" className='object-cover w-5 h-5 rounded-full' />}
          <Link className="hover:underline text-teal-500 text-sm" to={"/dashboard?tab=profile"}>
            {`@${currentUser.user.username}`}
          </Link>
        </div>

        :
        <div className='text-sm flex gap-1'>
          <div>You need to be signed in to comment.</div>
          <Link className="hover:underline text-teal-500 text-sm" to={"/signin"}>Sign In</Link>
        </div>
      }

      {currentUser &&

        <form onSubmit={handleComment} className='border-teal-500 border mt-5 p-3 rounded-md'>
          <Textarea
            placeholder='Add a comment...'
            rows="3"
            maxLength="200"
            className='p-2'
            value={comment} onChange={(e) => setComment(e.target.value)}></Textarea>

          <div className='mt-3 flex justify-between items-center'>
            <div className='text-sm'>{`${200 - comment.length} characters remaining`}</div>

            <Button type='submit' outline gradientDuoTone="purpleToPink">Submit</Button>
          </div>
          {error && <Alert color="failure" className='mt-5'>{error}</Alert>}
        </form>
      }

      {comments.length === 0 ? <p className='my-5'>No comments yet.</p> :
        <>
          <div className='my-5 flex gap-1 items-center text-sm'>
            <span>Comments</span>
            <span className='border border-black rounded-md pr-2 pl-2 '>{comments.length}</span>
          </div>

          {comments.map((comm, index) =>
            <Comm key={index}
              comm={comm}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />)}
        </>

      }

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>


    </div>
  )
}

export default Comments