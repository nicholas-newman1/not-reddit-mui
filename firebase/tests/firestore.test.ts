import * as firebase from '@firebase/rules-unit-testing';

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
    it('should not allow anyone', async () => {
      const db = firebase
        .initializeTestApp({ projectId: PROJECT_ID })
        .firestore();
      await firebase.assertFails(
        db.collection('users').doc('123').set({ hello: '123' })
      );
    });
  });

  //   describe('create', () => {
  //     beforeEach(() => {
  //       const auth = { uid: '123' };
  //       db = firebase
  //         .initializeTestApp({ projectId: PROJECT_ID, auth })
  //         .firestore();
  //     });

  //     it('should allow if document ID is the same as the user ID', async () => {
  //       await firebase.assertSucceeds(
  //         db.collection('users').doc('123').set({ bio: '' })
  //       );
  //     });

  //     it('should not allow if document ID is not the same as the user ID', async () => {
  //       await firebase.assertFails(
  //         db.collection('users').doc('1234').set({ bio: '' })
  //       );
  //     });

  //     it('should not allow if missing "bio" key', async () => {
  //       await firebase.assertFails(db.collection('users').doc('123').set({}));
  //     });
  //   });

  //   describe('update', () => {
  //     let adminDb;

  //     beforeEach(() => {
  //       const auth = { uid: '123' };
  //       db = firebase
  //         .initializeTestApp({ projectId: PROJECT_ID, auth })
  //         .firestore();
  //       adminDb = firebase
  //         .initializeAdminApp({ projectId: PROJECT_ID })
  //         .firestore();
  //     });

  //     it('should allow if document ID is the same as the user ID', async () => {
  //       adminDb.collection('users').doc('123').set({ bio: '' });
  //       await firebase.assertSucceeds(
  //         db.collection('users').doc('123').set({ bio: '123' })
  //       );
  //     });

  //     it('should not allow if document ID is not the same as the user ID', async () => {
  //       // create a doc with different ID than auth.uid to test an update against
  //       adminDb.collection('users').doc('666').set({ bio: '' });

  //       // try to update it
  //       await firebase.assertFails(
  //         db.collection('users').doc('666').set({ bio: '' })
  //       );
  //     });

  //     it('should not allow if adding extra fields', async () => {
  //       adminDb.collection('users').doc('123').set({ bio: '' });
  //       await firebase.assertFails(
  //         db.collection('users').doc('123').set({ bio: '123', randoField: 'hi' })
  //       );
  //     });
  //   });
});
