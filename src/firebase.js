// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBqqigQHenVvNCWXTpxkdKbdnm1A0gxOk",
  authDomain: "chat-553ad.firebaseapp.com",
  projectId: "chat-553ad",
  storageBucket: "chat-553ad.appspot.com",
  messagingSenderId: "867133350898",
  appId: "1:867133350898:web:4abf33ee6d961b740a416b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const Auth = getAuth()
export const storage = getStorage()
export const db  = getFirestore()