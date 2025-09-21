import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD69-tBVLI8ktnud6cevya0Tz1oD9Mzdgg",
  authDomain: "reminote-e494a.firebaseapp.com",
  projectId: "reminote-e494a",
  storageBucket: "reminote-e494a.firebasestorage.app",
  messagingSenderId: "1023548465598",
  appId: "1:1023548465598:web:17b8fda3acb735137bd9ef",
  measurementId: "G-3SKMX2MEPZ"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// 各サービスをエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
