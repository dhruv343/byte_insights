import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Want to get real-time insights about trending technologies?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout our news section Byte-sized Updates on our website
            </p>
            <Link to='/news'>
            <Button  className='rounded-tl-xl w-full bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl  rounded-bl-none'>
                Byte-sized Updates
            </Button>
            </Link>
            
        </div>
        <div className="p-7 flex-1">
            <img src="https://plus.unsplash.com/premium_photo-1678565999332-1cde462f7b24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D" />
        </div>
    </div>
  )
}