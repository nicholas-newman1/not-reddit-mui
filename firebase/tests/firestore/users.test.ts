import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const theirId = 'user_theirs';
let db: firebaseApp.firestore.Firestore;
let admin: firebaseApp.firestore.Firestore;

const getFirestore = (auth = null) =>
  firebase.initializeTestApp({ projectId: PROJECT_ID, auth }).firestore();

beforeEach(() => {
  db = getFirestore(myAuth);
  admin = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
});

afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

describe('/users', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(db.collection('users').get());
    });
  });

  describe('create', () => {
    const myPath = `users/${myId}`;
    const theirPath = `users/${theirId}`;

    it('should allow if document ID matches user ID', async () => {
      await firebase.assertSucceeds(db.doc(myPath).set({ username: '123' }));
    });

    it('should not allow if document ID does not match user ID', async () => {
      await firebase.assertFails(db.doc(theirPath).set({ username: '123' }));
    });

    it('should not allow having more fields than username', async () => {
      await firebase.assertFails(
        db.doc(myPath).set({ username: '123', other: '321' })
      );
    });

    it('should not allow missing username field', async () => {
      await firebase.assertFails(db.doc(myPath).set({}));
    });

    it('should only allow username to be a string', async () => {
      await firebase.assertFails(db.doc(myPath).set({ username: false }));
    });
  });

  describe('update', () => {
    const myPath = `users/${myId}`;
    const theirPath = `users/${theirId}`;

    it('should allow if document ID matches user ID', async () => {
      db.doc(myPath).set({ username: '123' });
      await firebase.assertSucceeds(db.doc(myPath).set({ username: '321' }));
    });

    it('should not allow if document ID does not match user ID', async () => {
      admin.doc(theirPath).set({ username: '123' });
      await firebase.assertFails(db.doc(theirPath).set({ username: '321' }));
    });

    it('should not allow having more fields than username', async () => {
      db.doc(myPath).set({ username: '123' });
      await firebase.assertFails(
        db.doc(myPath).set({ username: '123', other: '321' })
      );
    });

    it('should not allow missing username field', async () => {
      db.doc(myPath).set({ username: '123' });
      await firebase.assertFails(db.doc(myPath).set({}));
    });
  });
});
