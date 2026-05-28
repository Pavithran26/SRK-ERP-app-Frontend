import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// These should be in your .env or app.json constants
const firebaseConfig = {
  apiKey: "AIzaSyAZ_9b6SsfGhxpRPF2BIpj5j9E4AxTELf0",
  authDomain: "erp-pavithran26.firebaseapp.com",
  projectId: "erp-pavithran26",
  storageBucket: "erp-pavithran26.firebasestorage.app",
  messagingSenderId: "788720012163",
  appId: "1:788720012163:web:cb70c7a8ccdec0f021c4b6",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// NOTE: persistentLocalCache / persistentMultipleTabManager are web-only APIs.
// On React Native, Firestore uses in-memory cache by default.
const db = getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };
