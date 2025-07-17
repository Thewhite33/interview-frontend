import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA-R2Txpvc_8J-XIcLzVGjZ9xlJQfYQd4Q",
    authDomain: "interview-a58a0.firebaseapp.com",
    projectId: "interview-a58a0",
    storageBucket: "interview-a58a0.firebasestorage.app",
    messagingSenderId: "132639629674",
    appId: "1:132639629674:web:3c7ac47dbef7af3f5b0513"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
