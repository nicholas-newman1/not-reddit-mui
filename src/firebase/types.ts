import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

export type FirebaseError = firebase.FirebaseError;
export type FirebaseUser = firebase.User | null;
export type Timestamp = firebase.firestore.Timestamp;
export type DocumentSnapshot = firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;
