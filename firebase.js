import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDk7oD_WWpEj_hlYPlYSLFahn5-PZdFefo",
    authDomain: "interview-dd467.firebaseapp.com",
    projectId: "interview-dd467",
    storageBucket: "interview-dd467.firebasestorage.app",
    messagingSenderId: "437714681816",
    appId: "1:437714681816:web:684a74c2e801b798053cad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
