import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

let config: any = {
  apiKey: 'AIzaSyDUBhjnoHZOSxsp69GMHL6XfiBeSWC1-44',
  authDomain: 'not-reddit-5a7e3.firebaseapp.com',
  projectId: 'not-reddit-5a7e3',
  storageBucket: 'not-reddit-5a7e3.appspot.com',
  messagingSenderId: '951984622978',
  appId: '1:951984622978:web:7e88776937ac9d4836139b',
  measurementId: 'G-2YSX4475S9',
};

const app = firebase.initializeApp(config);

export const auth = firebase.auth(app);
export const db = firebase.firestore(app);
export const functions = firebase.functions(app);

if (process.env.NODE_ENV === 'development') {
  auth.useEmulator('http://localhost:9099');
  db.useEmulator('localhost', 8080);
  functions.useEmulator('localhost', 5001);
}

export const createCategory = (category: string) => {
  if (!auth.currentUser) return Promise.reject({ message: 'NO_USER' });
  return functions.httpsCallable('createCategory')(category);
};
