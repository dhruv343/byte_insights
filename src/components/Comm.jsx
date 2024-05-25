import React from 'react'
import moment from 'moment';
import { useState, useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { Button, Textarea } from 'flowbite-react';
import { useSelector } from 'react-redux';

function Comm({ comm, onLike ,onEdit ,onDelete}) {

  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comm.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`http://localhost:3500/api/test/${comm.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [comm]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comm.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3500/api/comment/editComment/${comm._id}`, {

        method: 'PUT',
        headers: {
          'Content-Type': "application/json",
          "authorization": currentUser.auth
        },

        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comm, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comm.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) :
          (
            <>
              <p className='text-gray-500 pb-2'>{comm.content}</p>

              <div className='flex gap-3'>

                <button
                  type='button'
                  onClick={() => onLike(comm._id)}
                  className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                    comm.likes.includes(currentUser.user._id) &&
                    '!text-blue-500'
                    }`}
                >
                  <FaThumbsUp className='text-sm' />
                </button>

                <p className='text-gray-400'>
                  {comm.numberOfLikes > 0 &&
                    comm.numberOfLikes +
                    ' ' +
                    (comm.numberOfLikes === 1 ? 'like' : 'likes')}
                </p>

                {
                  currentUser && (currentUser.user._id === comm.userId || currentUser.user.isAdmin) && (
                    <>
                      <button type='button' onClick={handleEdit} className='text-gray-400 hover:text-blue-500'>Edit</button>
                      <button
                        type='button'
                        onClick={() => onDelete(comm._id)}
                        className='text-gray-400 hover:text-red-500'
                      >
                        Delete
                      </button>
                    </>

                  )
                }

              </div>

            </>
          )}

      </div>
    </div>
  )
}

export default Comm