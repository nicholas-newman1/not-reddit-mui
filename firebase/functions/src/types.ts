import * as firebase from 'firebase-admin';

export interface User {
  username: string;
}

export interface Post {
  authorId: string;
  authorUsername: string;
  body: string;
  categoryId: string;
  daysWhenPostIsLessThanWeekOld: number[];
  edited: boolean;
  numOfComments: number;
  rating: number;
  timestamp: firebase.firestore.Timestamp;
  title: string;
}
