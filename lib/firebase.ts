import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase, onValue, ref, set, update } from "firebase/database"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDQqo1vf2sH9vqwIe88vlsyMG93hlOMBSM",
  authDomain: "goza-chat.firebaseapp.com",
  projectId: "goza-chat",
  databaseURL: "https://goza-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "goza-chat.appspot.com",
  messagingSenderId: "927940347128",
  appId: "1:927940347128:web:4c882d3f38741a747ba70d",
  measurementId: "G-SBSW3HW0Y9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const store = getFirestore(app)
export const realtime = getDatabase(app)