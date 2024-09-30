// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey : "AIzaSyBHo4gpW7vioecJeRTAUThs-KOtfz1Y31M" , 
  authDomain : "movie-management-73bf9.firebaseapp.com" , 
  projectId : "movie-management-73bf9" , 
  storageBucket : "movie-management-73bf9.appspot.com" , 
  messagingSenderId : "66270218337" , 
  appId : "1:66270218337:web:e94000b40d00e1bd0f4220" , 
  measurementId : "G-T61Z639D7J" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

export { storage, googleProvider, auth };