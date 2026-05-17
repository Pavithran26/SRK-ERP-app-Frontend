import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
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

// Initialize Firebase with Offline Persistence enabled
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const auth = getAuth(app);

export { app, db, auth };
