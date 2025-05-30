import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxw_66yetBOJIkD83Fa_orPjGtidOYFn8",
  authDomain: "masters-fantasy-golf-579c6.firebaseapp.com",
  projectId: "masters-fantasy-golf-579c6",
  storageBucket: "masters-fantasy-golf-579c6.firebasestorage.app",
  messagingSenderId: "1015942645879",
  appId: "1:1015942645879:web:ccc96fec7bd35df53d5e72",
  measurementId: "G-V9TCCNR726"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
