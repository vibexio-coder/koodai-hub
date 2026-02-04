import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWULPc5KAulLax8J_LswgojmRdvT8_P94",
  authDomain: "koodai-24c65.firebaseapp.com",
  projectId: "koodai-24c65",
  storageBucket: "koodai-24c65.appspot.com",
  messagingSenderId: "1029772489476",
  appId: "1:1029772489476:web:35d6a1d36316b8d1635651",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
