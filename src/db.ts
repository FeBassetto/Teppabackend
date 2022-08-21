import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
import config from "./config";


const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

export default db