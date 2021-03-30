import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

const PROJECT_ID = 'not-reddit-5a7e3';

afterEach(async () => {
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

let uid = '123';
let db: firebaseApp.firestore.Firestore;
let adminDb: firebaseApp.firestore.Firestore;

beforeEach(() => {
  db = firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth: { uid } })
    .firestore();
  adminDb = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();
});

describe('/users', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = firebase
        .initializeTestApp({ projectId: PROJECT_ID })
        .firestore();
      await firebase.assertSucceeds(db.collection('users').get());
    });
  });

  describe('write', () => {
    it('should allow if document ID matches user ID', async () => {
      await firebase.assertSucceeds(
        db.collection('users').doc(uid).set({ username: '123' })
      );
    });

    it('should not allow if document ID does not match user ID', async () => {
      await firebase.assertFails(
        db
          .collection('users')
          .doc(uid + '45')
          .set({ username: '123' })
      );
    });

    it('should not allow having more fields than username', async () => {
      await firebase.assertFails(
        db.collection('users').doc(uid).set({ username: '123', other: '321' })
      );
    });

    it('should not allow missing username field', async () => {
      await firebase.assertFails(db.collection('users').doc('123').set({}));
    });
  });
});

describe('/categories', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = firebase
        .initializeTestApp({ projectId: PROJECT_ID })
        .firestore();
      await firebase.assertSucceeds(db.collection('categories').get());
    });
  });

  describe('create', () => {
    it('should not allow anyone', async () => {
      const db = firebase
        .initializeTestApp({ projectId: PROJECT_ID })
        .firestore();
      await firebase.assertFails(
        db.collection('categories').doc('meditation').set({})
      );
    });

    describe('/moderatorIds', () => {
      // a document ref repeatedly used in the following tests
      const moderatorIdRef = (db: firebaseApp.firestore.Firestore) =>
        db
          .collection('categories')
          .doc('meditation')
          .collection('moderatorIds')
          .doc('modguy2');

      it('should allow owner', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to moderatorIds
        await firebase.assertSucceeds(moderatorIdRef(db).set({ exists: true }));
      });

      it('should not allow documents without a marker', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to moderatorIds
        await firebase.assertFails(moderatorIdRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to moderatorIds
        await firebase.assertFails(
          moderatorIdRef(db).set({ exists: true, notAllowed: true })
        );
      });
    });

    describe('/subscriberIds', () => {
      // a document ref repeatedly used in the following tests
      const subscriberIdRef = (db: firebaseApp.firestore.Firestore) =>
        db
          .collection('categories')
          .doc('meditation')
          .collection('subscriberIds')
          .doc(uid);

      it('should allow if document ID matches user ID', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        // current user should be allowed to add themself to subscriberIds
        await firebase.assertSucceeds(
          subscriberIdRef(db).set({ exists: true })
        );
      });

      it('should not allow documents without a marker', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        await firebase.assertFails(subscriberIdRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        await firebase.assertFails(
          subscriberIdRef(db).set({ exists: true, extraField: 'poop' })
        );
      });

      it('should not allow if user is banned', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        // ban current user
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('bannedIds')
          .doc(uid)
          .set({ exists: true });

        await firebase.assertFails(subscriberIdRef(db).set({ exists: true }));
      });

      it('should not allow if category does not exist', async () => {
        await firebase.assertFails(subscriberIdRef(db).set({}));
      });
    });

    describe('/bannedIds', () => {
      // a document ref repeatedly used in the following tests
      const bannedIdRef = (db: firebaseApp.firestore.Firestore) =>
        db
          .collection('categories')
          .doc('meditation')
          .collection('bannedIds')
          .doc('bannedguy22');

      it('should allow owner', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to bannedIds
        await firebase.assertSucceeds(bannedIdRef(db).set({ exists: true }));
      });

      it('should allow moderators', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        // add current user to moderators
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('moderatorIds')
          .doc(uid)
          .set({ exists: true });

        // current user (as moderator) should be allowed to add documents to bannedIds
        await firebase.assertSucceeds(bannedIdRef(db).set({ exists: true }));
      });

      it('should not allow documents without a marker', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to bannedIds
        await firebase.assertFails(bannedIdRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // current user (as owner) should be allowed to add documents to bannedIds
        await firebase.assertFails(
          bannedIdRef(db).set({ exists: true, hackerNoob: true })
        );
      });
    });
  });

  describe('update', () => {
    it('should allow owner to change the owner', async () => {
      // create collection with current user as owner
      adminDb.collection('categories').doc('meditation').set({
        ownerId: uid,
      });

      await firebase.assertSucceeds(
        db.collection('categories').doc('meditation').set({
          ownerId: '321',
        })
      );
    });

    it('should not allow owner to change any field except ownerId', async () => {
      adminDb.collection('categories').doc('meditation').set({
        ownerId: uid,
      });

      await firebase.assertFails(
        db.collection('categories').doc('meditation').set({
          ownerId: '321',
          randoField: 123,
        })
      );
    });
  });

  describe('delete', () => {
    describe('/moderatorIds', () => {
      it('should allow owner to delete moderators', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // add a document to moderatorIds
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('moderatorIds')
          .doc('badmodguy')
          .set({ exists: true });

        await firebase.assertSucceeds(
          db
            .collection('categories')
            .doc('meditation')
            .collection('moderatorIds')
            .doc('badmodguy')
            .delete()
        );
      });
    });

    describe('/subscriberIds', () => {
      it('should allow owner to delete subscribers', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // add a document to subscriberIds
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('subscriberIds')
          .doc('badsubscriber')
          .set({ exists: true });

        await firebase.assertSucceeds(
          db
            .collection('categories')
            .doc('meditation')
            .collection('subscriberIds')
            .doc('badsubscriber')
            .delete()
        );
      });

      it('should allow moderators to delete subscribers', async () => {
        // create collection with current user as owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        // add a document to subscriberIds
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('subscriberIds')
          .doc('badsubscriber')
          .set({ exists: true });

        // add current user to moderators
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('moderatorIds')
          .doc(uid)
          .set({ exists: true });

        await firebase.assertSucceeds(
          db
            .collection('categories')
            .doc('meditation')
            .collection('subscriberIds')
            .doc('badsubscriber')
            .delete()
        );
      });
    });

    describe('/bannedIds', () => {
      it('should allow owner to delete bans', async () => {
        // create collection with current user as owner
        adminDb.collection('categories').doc('meditation').set({
          ownerId: uid,
        });

        // add a document to bannedIds
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('bannedIds')
          .doc('badsubscriber')
          .set({ exists: true });

        await firebase.assertSucceeds(
          db
            .collection('categories')
            .doc('meditation')
            .collection('bannedIds')
            .doc('badsubscriber')
            .delete()
        );
      });

      it('should allow moderators to delete bans', async () => {
        // create collection with random owner
        adminDb
          .collection('categories')
          .doc('meditation')
          .set({ ownerId: uid + 123 });

        // add a document to bannedIds
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('bannedIds')
          .doc('badsubscriber')
          .set({ exists: true });

        // add current user to moderators
        adminDb
          .collection('categories')
          .doc('meditation')
          .collection('moderatorIds')
          .doc(uid)
          .set({ exists: true });

        await firebase.assertSucceeds(
          db
            .collection('categories')
            .doc('meditation')
            .collection('bannedIds')
            .doc('badsubscriber')
            .delete()
        );
      });
    });
  });
});
