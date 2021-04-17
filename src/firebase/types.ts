import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

export type FirebaseError = firebase.FirebaseError;
export type FirebaseUser = firebase.User | null;
export type Timestamp = firebase.firestore.Timestamp;
export type DocumentSnapshot = firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;

export interface DBUser {
  username: string;
}

export interface DBPost {
  title: string;
  body: string;
  authorId: string;
  authorUsername: string | null;
  categoryId: string;
  edited: boolean;
  rating: number;
  timestamp: Timestamp;
  daysWhenPostIsLessThanWeekOld: string[];
}

export interface DBCategory {
  ownerId: string;
  numOfModerators: number;
  numOfSubscribers: number;
}
