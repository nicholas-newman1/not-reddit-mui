import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let config: any = {
  apiKey: 'AIzaSyDUBhjnoHZOSxsp69GMHL6XfiBeSWC1-44',
  authDomain: 'not-reddit-5a7e3.firebaseapp.com',
  projectId: 'not-reddit-5a7e3',
  storageBucket: 'not-reddit-5a7e3.appspot.com',
  messagingSenderId: '951984622978',
  appId: '1:951984622978:web:7e88776937ac9d4836139b',
  measurementId: 'G-2YSX4475S9',
};

if (process.env.NODE_ENV === 'development') {
  config.databaseURL = 'http://localhost:8080?ns=emulatorui';
}

const app = firebase.initializeApp(config);

export type FirebaseError = firebase.FirebaseError;
export type FirebaseUser = firebase.User | null;
export const auth = firebase.auth();
export const db = firebase.firestore(app);

if (process.env.NODE_ENV === 'development') {
  auth.useEmulator('http://localhost:9099');
}
