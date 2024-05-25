import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { img1, img2 } from '../images/image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from 'react';
import PostCard from "../components/PostCard"

function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('http://localhost:3500/api/create/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);



  var settings = {
    // dots: true,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    rtl: true

  };

  var settings2 = {
    // dots: true,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
  };

  

  return (
    <div className='min-h-screen'>

      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-5xl mt-10 mb-4 font-serif md:text-7xl auto-type">Explore Byte Insights</h1>
        <p className="text-md mt-5 md:mt-10 text-gray-700 mb-8 md:text-lg">
          Explore diverse tech topics and gain valuable insights at Byte Insights. Dive into dynamic thinking and discover fresh perspectives and knowledge on a wide range of subjects.</p>
        <Link to={"/search"}><Button gradientDuoTone="greenToBlue" outline className='font-bold'>Let's Explore</Button></Link>
      </div>

      <div className='pr-5 pl-5 p-2 '>
        <Slider {...settings}>
          {img1.map((imgUrl, index) =>
            <img src={imgUrl} className='rounded-lg shadow-md hover:drop-shadow-2xl shadow-black h-[330px] w-[580px] object-cover' key={index} alt={`img${index}`} />
          )}
          {/* {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))} */}
        </Slider>
      </div>

      <div className='pr-5 pl-5 mt-2 p-2 '>
        <Slider {...settings2}>
          {img2.map((imgUrl, index) =>
            <img src={imgUrl} className='rounded-lg shadow-md hover:drop-shadow-2xl shadow-black h-[330px] w-[580px] object-cover' key={index} alt={`img${index}`} />
          )}
        </Slider>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 mt-16'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-4xl md:text-4xl font-serif p-3 border-b border-teal-500'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 mt-10'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}

export default Home