// Fix: Use Firebase v8 compat imports to resolve module export errors
// Fix: Use a default import for the firebase app object.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Fix: Use Firebase v8 initialization syntax
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
export const storage = firebase.storage();

export default firebase;