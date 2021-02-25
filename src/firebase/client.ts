import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyDUBhjnoHZOSxsp69GMHL6XfiBeSWC1-44',
  authDomain: 'not-reddit-5a7e3.firebaseapp.com',
  projectId: 'not-reddit-5a7e3',
  storageBucket: 'not-reddit-5a7e3.appspot.com',
  messagingSenderId: '951984622978',
  appId: '1:951984622978:web:7e88776937ac9d4836139b',
  measurementId: 'G-2YSX4475S9',
});

export type FirebaseError = firebase.FirebaseError;
export type FirebaseUser = firebase.User | null;
export const db = firebase.firestore(app);
export const auth = app.auth();
export default app;
