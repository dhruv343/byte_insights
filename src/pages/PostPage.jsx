import { Button, Spinner } from 'flowbite-react'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CallToAction from '../components/CalltoAction'
import Comments from '../components/Comments'
function PostPage() {

  const { postSlug } = useParams()
  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const result = await fetch(`http://localhost:3500/api/create/getPosts?slug=${postSlug}`, {
          method: 'get',
          headers: {
            'Content-Type': "application/json",
          }
        })

        const data = await result.json()

        if (result.ok) {
          setLoading(false)
          setPost(data.posts[0])
        }
        else {
          setLoading(false)
          console.log(data.message)
        }
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }


    }
    fetchPost()
  }, [postSlug]
  )



  console.log(post)

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'><Spinner size='xl' /></div>
    )
  }
  return (
    <div className='p-3 min-h-screen flex flex-col max-w-6xl mx-auto'>
      <h1 className='p-5 text-4xl max-w-4xl mx-auto text-center mt-10 font-serif lg:text-5xl'>{post && post.title}</h1>

      <Link to={`/search?category=${post && post.category}`} className='self-center'>
        <Button color='gray' pill >{post && post.category}</Button>
      </Link>

      <img src={post && post.image} className='p-5 w-full max-h-[600px] mt-5 object-cover ' alt={post && post.title} />

      <div className='mt-1 flex max-w-2xl mx-auto justify-between w-full p-5 border-b-2'>

        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post.content && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>

      <div
        className='p-3 max-w-3xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />

        <Comments postId={post._id}/>
      </div>
     
     
    </div>


  )
}

export default PostPage