import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
   apiKey: import.meta.env.VITE_APIKEY,
   authDomain: import.meta.env.VITE_AUTHDOMAIN,
   projectId: import.meta.env.VITE_PROJECTID,
   storageBucket: import.meta.env.VITE_STORAGEBUCKET,
   messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
   appId: import.meta.env.VITE_APPID,
   measurementId: import.meta.env.VITE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const firebaseRTDB = getDatabase(app);
