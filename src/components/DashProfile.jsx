import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux"
import { Alert, Button, Spinner, TextInput, Modal } from "flowbite-react"
import { app } from "../firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch } from "react-redux"
import { updateFailure, updateStart, updateSuccess, deleteFailure, deleteStart, deleteSuccess, signOut } from '../redux/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom'


function DashProfile() {

    const { currentUser, error } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateS, setUpdateS] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const filePickerRef = useRef();
    const [formdata, setFormdata] = useState({});
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImageUrl(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])


    const uploadImage = () => {
        setImageFileUploadError(null);
        setLoading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                //   setImageFileUploadProgress(null);
                setImageFile(null);
                setImageUrl(null);
                setLoading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setFormdata({ ...formdata, profilePicture: downloadURL })
                    setLoading(false);
                });
            }
        );

    }

    const handleformChange = (e) => {
        setFormdata({ ...formdata, [e.target.id]: e.target.value })
    }


    const handleSubmit = async (e) => {


        setUpdateError(null)
        setUpdateS(null)

        if (loading) {
            setUpdateError("Please wait for the image to be uploaded properly")
            return;
        }

        if (Object.keys(formdata).length === 0) {
            setUpdateError("No changes made")
            return;
        }


        try {
            dispatch(updateStart())

            let result = await fetch(`http://localhost:3500/api/test/updateUser/${currentUser.user._id}`, {
                method: 'put',
                body: JSON.stringify(formdata),
                headers: {
                    'Content-Type': "application/json",
                    "authorization": currentUser.auth
                }
            })
            const data = await result.json();
            console.log(data);
            if (!result.ok) {
                dispatch(updateFailure(data.message));
                setUpdateError(data.message)
            }
            else {
                dispatch(updateSuccess(data));
                setUpdateS("User updated successfully")
            }

        }
        catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateError(error.message)
        }
    }

    const handleDeleteUser = async () => {


        setShowModal(false)
        try {
            dispatch(deleteStart())
            let result = await fetch(`http://localhost:3500/api/test/deleteUser/${currentUser.user._id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': "application/json"
                    , "authorization": currentUser.auth
                }
            })
            const data = await result.json()

            if (!result.ok) {
                dispatch(deleteFailure(data.message));
            }

            else {
                // localStorage.clear('root')
                dispatch(deleteSuccess())
                // window.location.href = './signup'

            }
        } catch (error) {
            deleteFailure(error.message)
        }

    }
    console.log(imageFileUploadProgress, imageUrl);
    console.log(formdata);

    return (
        <div className='p-5 flex flex-col md:mt-5 gap-7 max-w-lg mx-auto w-full'>
            <div className='self-center font-bold text-3xl'>Profile</div>

            <div className='w-[120px] h-[120px] self-center rounded-full flex justify-center items-center'>
                {loading ? <>
                    <Spinner size='xl' />
                </> :
                    <img src={imageUrl || currentUser.user.profilePicture} className='rounded-full w-full h-full border-gray-400 border-8 object-cover' alt="no-img" onClick={() => filePickerRef.current.click()} />
                }

            </div>

            <form className='flex flex-col gap-5'>

                <input type="file" accept='image/*' onChange={handleImage} ref={filePickerRef} className='hidden' />
                {imageFileUploadError ? <><Alert color='failure'>{imageFileUploadError}</Alert></> : ""}
                <TextInput type="text" defaultValue={currentUser.user.username} id="username" onChange={handleformChange} />
                <TextInput type="email" defaultValue={currentUser.user.email} id="email" onChange={handleformChange} />
                <TextInput type="password" placeholder='Password' id="password" onChange={handleformChange} />
                <Button gradientDuoTone="purpleToPink" onClick={handleSubmit} outline>Update</Button>
                {
                    currentUser.user.isAdmin && <Link to={'/create-post'}> <Button gradientDuoTone="purpleToBlue" className='w-full' >
                        Create a post</Button></Link>
                }
            </form>
            <div className='flex justify-between text-red-600'>
                <span onClick={() => setShowModal(true)}>Delete Account</span>
                <span onClick={() => dispatch(signOut())}>Sign out</span>
            </div>
            {updateS && <Alert color='success' className='mt-5'>{updateS}</Alert>}

            {updateError && <Alert color='failure' className='mt-5'>{updateError}</Alert>}

            {showModal && <Modal show={showModal} onClose={() => { setShowModal(false) }} popup>

                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>}

            {
                error && <Alert color='failure' className='mt-5'>{error}</Alert>
            }

        </div>


    )
}

export default DashProfile