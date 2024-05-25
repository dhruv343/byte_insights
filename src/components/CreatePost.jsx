import React from 'react'
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react"
import ReactQuill from 'react-quill';
import {htmlToText} from 'html-to-text';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreatePost() {

    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [publishError, setPublishError] = useState(null);

    const { currentUser } = useSelector((state) => state.user)


    const handleUpdloadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            let result = await fetch("http://localhost:3500/api/create/post", {
                method: 'post',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': "application/json",
                    "authorization": currentUser.auth
                }
            })
            const data = await result.json();
            
            if(result.ok){
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
            else{
                setPublishError(data.message);
                return;
            }


        } catch (error) {
            setPublishError("Something went wrong")
        }

    }

    return (

        <div className='min-h-screen p-3 max-w-3xl flex flex-col gap-5 mx-auto mb-10'>
            <h1 className='text-3xl my-7 font-semibold mx-auto'>Create a Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'
            >
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                    <TextInput className="flex-1" required placeholder='Title' id='title'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value="uncategorized">Select a category</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Web3">Web3</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="AR/VR">AR/VR</option>
                    </Select>
                </div>

                <div className='flex justify-between gap-2 border-dotted border-green-400 border-[3px] p-4'>

                    <FileInput type='file' accept='img/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        gradientDuoTone="purpleToPink"
                        outline size='sm'
                        onClick={handleUpdloadImage}
                        disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}</Button>
                </div>

                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    required
                    className='h-72 mb-12'

                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}

                    
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>

                {publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
            </form>


        </div>
    )
}

export default CreatePost