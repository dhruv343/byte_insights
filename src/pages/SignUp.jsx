import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { useSelector } from 'react-redux';
function SignUp() {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    // useEffect(()=>{
    //     if(currentUser){
    //         navigate('/')
    //     }
    // },[])

    const validateEmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };
    const handleSignup = async () => {
        if (!name || !email || !password) {
            return setError("Please fill out all fields")
        }
        if (!validateEmail(email)) {
            return setError("Please enter a valid Gmail address");
        }
        try {

            setLoading(true);
            setError(null);
            let res = await fetch("http://localhost:3500/api/user/auth", {
                method: 'post',
                body: JSON.stringify({
                    username: name, email, password
                }),
                headers: {
                    'Content-Type': "application/json"
                }
            })
            res = await res.json();
            console.log(res);

            setLoading(false);

            if (res.success === false) {
                setError(res.message);
                setLoading(false);
            }
            if (res.username) {
                navigate('/signin')
            }

        }
        catch (err) {
            setError(err.message);
        }


    }
    return (
        <div className='min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto'>
            <div className='flex flex-col gap-4 p-3 text-center'>
                <Link to='/' className='font-bold text-4xl'>
                    <span className='px-2 italic  mr-1 py-1 bg-gradient-to-r  from-green-400 via-blue-500 to-indigo-500  rounded-md shadow-md text-white font-extrabold'>Byte</span>
                    <span className='font-extrabold italic'>Insights</span>
                </Link>
                <div className='text-lg'>Sign up with your email and password or with Google.</div>
            </div>
            <form className="flex flex-col gap-5 p-3 w-full md:w-96">

                <div>
                    <Label value='Your username' />
                    <TextInput
                        placeholder='Enter your username'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <Label value='Your email' />
                    <TextInput
                        placeholder='Enter your email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <Label value='Your password' />
                    <TextInput
                        placeholder='Enter your password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button className='w-full ' gradientDuoTone="purpleToBlue" type='button' onClick={handleSignup} disabled={loading}>

                    {
                        loading ? (<>
                            <Spinner size='sm' />
                            <span className='pl-3'>Loading</span>
                        </>) : `Sign Up`
                    }


                </Button>
                <OAuth />
                <div>Have an account? <span>
                    <Link to='/signin' className='text-blue-600'>SignIn</Link>
                </span></div>

                {error && <Alert className='mt-5' color='failure'>{error}</Alert>}
            </form>

        </div>
    )
}

export default SignUp
