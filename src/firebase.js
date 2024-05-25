// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-565df.firebaseapp.com",
  projectId: "mern-blog-565df",
  storageBucket: "mern-blog-565df.appspot.com",
  messagingSenderId: "414536687642",
  appId: "1:414536687642:web:f597c1e3fdae9cfa98f1a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);