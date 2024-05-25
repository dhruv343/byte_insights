import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import { Button } from 'flowbite-react';
import { app } from "../firebase"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/userSlice';

function OAuth() {
  const auth = getAuth(app)
  const navigate=useNavigate();
  const dispatch=useDispatch()

  const handleGoogleLogin = async () => {

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' })

    try {

      const resultFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultFromGoogle);
      let result = await fetch("http://localhost:3500/api/user/google", {
        method: "post",
        body: JSON.stringify(
          {
            name: resultFromGoogle.user.displayName,
            email: resultFromGoogle.user.email,
            photoUrl: resultFromGoogle.user.photoURL
          }),
        headers: {
          'Content-Type': "application/json"
        }
      })
      const data = await result.json();
      
      console.log(data);

      if (data.user) {
        navigate('/')
        dispatch(signInSuccess(data))
      }

    }

    catch (error) {
      console.log(error)
    }

  }
  return (
    <Button type="button" className='w-full flex items-center' outline gradientDuoTone="pinkToOrange" onClick={handleGoogleLogin}>

      <span > <AiFillGoogleCircle className='w-6 h-6 mr-2'/></span>
      <div>Continue with Google</div>
    </Button>
  )
}

export default OAuth