// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYyfkU2yaZFJrEruAUPq9nAD5WRVWI1bM",
  authDomain: "dboa-41a7b.firebaseapp.com",
  databaseURL: "https://dboa-41a7b.firebaseio.com",
  projectId: "dboa-41a7b",
  storageBucket: "dboa-41a7b.appspot.com",
  messagingSenderId: "366004332123",
  appId: "1:366004332123:web:2b05d280cce00ba52f017e",
  measurementId: "G-2WHWDH7WX2",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
