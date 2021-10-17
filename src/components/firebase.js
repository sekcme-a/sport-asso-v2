import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlsfFehVyaCDuIjVtT_4RxgOOQ7FT2ycI",
  authDomain: "sports-asso-v2.firebaseapp.com",
  projectId: "sports-asso-v2",
  storageBucket: "sports-asso-v2.appspot.com",
  messagingSenderId: "132891953598",
  appId: "1:132891953598:web:00f9d681357376afec11ef",
  measurementId: "G-JEEYC4CL24"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();