// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbmWpedQ52aBmLHXzWXcHbPUhlSUt0Lzc",
  authDomain: "pantry-tracker-45661.firebaseapp.com",
  projectId: "pantry-tracker-45661",
  storageBucket: "pantry-tracker-45661.appspot.com",
  messagingSenderId: "299137428380",
  appId: "1:299137428380:web:969b5b493534a7e05cf659",
  measurementId: "G-REJRSW9Q93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
