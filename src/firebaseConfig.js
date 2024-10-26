import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMOg-1qKMIwOhDC4hLunxxHgaD-zPLudQ",
  authDomain: "project-pfe-caa3a.firebaseapp.com",
  projectId: "project-pfe-caa3a",
  storageBucket: "project-pfe-caa3a.appspot.com",
  messagingSenderId: "920970966364",
  appId: "1:920970966364:web:5ee939aeca5c249ffc7d99",
  measurementId: "G-0BWP9V11FP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
