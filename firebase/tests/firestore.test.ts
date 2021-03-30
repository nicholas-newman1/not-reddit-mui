import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

const PROJECT_ID = 'not-reddit-5a7e3';

afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

describe('users', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = firebase
        .initializeTestApp({ projectId: PROJECT_ID })
        .firestore();
      await firebase.assertSucceeds(db.collection('users').get());
    });
  });

  describe('write', () => {
    let db: firebaseApp.firestore.Firestore;

    beforeEach(() => {
      db = firebase
        .initializeTestApp({ projectId: PROJECT_ID, auth: { uid: '123' } })
        .firestore();
    });

    it('should allow if document ID matches user ID', async () => {
      await firebase.assertSucceeds(
        db.collection('users').doc('123').set({ username: '123' })
      );
    });

    it('should not allow if document ID does not match user ID', async () => {
      await firebase.assertFails(
        db.collection('users').doc('12345').set({ username: '123' })
      );
    });

    it('should not allow having more fields than username', async () => {
      await firebase.assertFails(
        db.collection('users').doc('123').set({ username: '123', other: '321' })
      );
    });

    it('should not allow missing username field', async () => {
      await firebase.assertFails(db.collection('users').doc('123').set({}));
    });
  });
});
