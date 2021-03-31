import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const myUnverifiedAuth = { uid: myId };
const theirId = 'user_theirs';
const thirdId = 'user_third';
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

describe('/categories', () => {
  const categoryPath = 'categories/meditation';
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(db.collection('categories').get());
    });
  });

  describe('create', () => {
    it('should allow verified users', async () => {
      await firebase.assertSucceeds(
        db.doc(categoryPath).set({ ownerId: myId })
      );
    });

    it('should not allow unauthenticated users', async () => {
      const db = getFirestore();
      await firebase.assertFails(db.doc(categoryPath).set({ ownerId: myId }));
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await firebase.assertFails(db.doc(categoryPath).set({ ownerId: myId }));
    });

    it('should not allow categories of length < 3', async () => {
      await firebase.assertFails(
        db.doc('/categories/a').set({ ownerId: myId })
      );
    });

    it('should not allow uppercase characters', async () => {
      await firebase.assertFails(
        db.doc('/categories/abcABC').set({ ownerId: myId })
      );
    });

    it('should not allow non-alphanumeric characters', async () => {
      await firebase.assertFails(
        db.doc('/categories/abc!@#').set({ ownerId: myId })
      );
    });

    describe('/moderatorIds', () => {
      const theirModeratorRef = (db: firebaseApp.firestore.Firestore) =>
        db.doc(`${categoryPath}/moderatorIds/${theirId}`);

      it('should allow owner', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertSucceeds(
          theirModeratorRef(db).set({ exists: true })
        );
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertFails(theirModeratorRef(db).set({ exists: true }));
      });

      it('should not allow documents without a marker', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertFails(theirModeratorRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertFails(
          theirModeratorRef(db).set({ exists: true, notAllowed: true })
        );
      });
    });

    describe('/subscriberIds', () => {
      const mySubscriberRef = (db: firebaseApp.firestore.Firestore) =>
        db.doc(`${categoryPath}/subscriberIds/${myId}`);

      it('should allow if document ID matches user ID', async () => {
        admin.doc(categoryPath).set({ ownerId: theirId });
        await firebase.assertSucceeds(
          mySubscriberRef(db).set({ exists: true })
        );
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        admin.doc(categoryPath).set({ ownerId: theirId });
        await firebase.assertFails(mySubscriberRef(db).set({ exists: true }));
      });

      it('should not allow documents without a marker', async () => {
        admin.doc(categoryPath).set({ ownerId: theirId });
        await firebase.assertFails(mySubscriberRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        admin.doc(categoryPath).set({ ownerId: theirId });
        await firebase.assertFails(
          mySubscriberRef(db).set({ exists: true, extraField: 'poop' })
        );
      });

      it('should not allow if user is banned', async () => {
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
        await firebase.assertFails(mySubscriberRef(db).set({ exists: true }));
      });

      it('should not allow if category does not exist', async () => {
        await firebase.assertFails(mySubscriberRef(db).set({}));
      });
    });

    describe('/bannedIds', () => {
      const theirBannedRef = (db: firebaseApp.firestore.Firestore) =>
        db.doc(`${categoryPath}/bannedIds/${theirId}`);

      it('should allow owner', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertSucceeds(theirBannedRef(db).set({ exists: true }));
      });

      it('should allow moderators', async () => {
        admin.doc(categoryPath).set({ ownerId: thirdId });
        admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
        await firebase.assertSucceeds(theirBannedRef(db).set({ exists: true }));
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        admin.doc(categoryPath).set({ ownerId: thirdId });
        admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
        await firebase.assertFails(theirBannedRef(db).set({ exists: true }));
      });

      it('should not allow moderators to ban owner', async () => {
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
        await firebase.assertFails(theirBannedRef(db).set({ exists: true }));
      });

      it('should not allow documents without a marker', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertFails(theirBannedRef(db).set({}));
      });

      it('should not allow documents with extra fields', async () => {
        admin.doc(categoryPath).set({ ownerId: myId });
        await firebase.assertFails(
          theirBannedRef(db).set({ exists: true, hackerNoob: true })
        );
      });
    });
  });

  describe('update', () => {
    it('should allow owner to change the owner', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      await firebase.assertSucceeds(
        db.doc(categoryPath).set({ ownerId: theirId })
      );
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      admin.doc(categoryPath).set({ ownerId: myId });
      await firebase.assertFails(
        db.doc(categoryPath).set({ ownerId: theirId })
      );
    });

    it('should not allow owner to change any field except ownerId', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      await firebase.assertFails(
        db.doc(categoryPath).set({ ownerId: theirId, randoField: 123 })
      );
    });
  });

  describe('delete', () => {
    describe('/moderatorIds', () => {
      it('should allow owner to delete moderators', async () => {
        const moderatorPath = `${categoryPath}/moderatorIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: myId });
        admin.doc(moderatorPath).set({ exists: true });
        await firebase.assertSucceeds(db.doc(moderatorPath).delete());
      });

      it('should allow moderators to delete themselves', async () => {
        const moderatorPath = `${categoryPath}/moderatorIds/${myId}`;
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(moderatorPath).set({ exists: true });
        await firebase.assertSucceeds(db.doc(moderatorPath).delete());
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        const moderatorPath = `${categoryPath}/moderatorIds/${myId}`;
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(moderatorPath).set({ exists: true });
        await firebase.assertFails(db.doc(moderatorPath).delete());
      });
    });

    describe('/subscriberIds', () => {
      it('should allow owner to delete subscribers', async () => {
        const subscriberPath = `${categoryPath}/subscriberIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: myId });
        admin.doc(subscriberPath).set({ exists: true });
        await firebase.assertSucceeds(db.doc(subscriberPath).delete());
      });

      it('should allow moderators to delete subscribers', async () => {
        const subscriberPath = `${categoryPath}/subscriberIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: thirdId });
        admin.doc(subscriberPath).set({ exists: true });
        admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
        await firebase.assertSucceeds(db.doc(subscriberPath).delete());
      });

      it('should allow subscribers to delete themselves', async () => {
        const subscriberPath = `${categoryPath}/subscriberIds/${myId}`;
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(subscriberPath).set({ exists: true });
        await firebase.assertSucceeds(db.doc(subscriberPath).delete());
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        const subscriberPath = `${categoryPath}/subscriberIds/${myId}`;
        admin.doc(categoryPath).set({ ownerId: theirId });
        admin.doc(subscriberPath).set({ exists: true });
        await firebase.assertFails(db.doc(subscriberPath).delete());
      });
    });

    describe('/bannedIds', () => {
      it('should allow owner to delete bans', async () => {
        const bannedPath = `${categoryPath}/bannedIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: myId });
        admin.doc(bannedPath).set({ exists: true });
        await firebase.assertSucceeds(db.doc(bannedPath).delete());
      });

      it('should allow moderators to delete bans', async () => {
        const bannedPath = `${categoryPath}/bannedIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: thirdId });
        admin.doc(bannedPath).set({ exists: true });
        admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
        await firebase.assertSucceeds(db.doc(bannedPath).delete());
      });

      it('should not allow unverified users', async () => {
        const db = getFirestore(myUnverifiedAuth);
        const bannedPath = `${categoryPath}/bannedIds/${theirId}`;
        admin.doc(categoryPath).set({ ownerId: myId });
        admin.doc(bannedPath).set({ exists: true });
        await firebase.assertFails(db.doc(bannedPath).delete());
      });
    });
  });
});
