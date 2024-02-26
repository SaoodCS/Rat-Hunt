import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

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

if (import.meta.env.VITE_RUNNING === 'local') {
   type Self = typeof self;
   type TSelf = Self & { FIREBASE_APPCHECK_DEBUG_TOKEN: string };
   (self as TSelf).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECKDEBUGTOKEN;
}
initializeAppCheck(app, {
   provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHASITEKEY),
   isTokenAutoRefreshEnabled: true,
});
export default app;
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const firebaseRTDB = getDatabase(app);
