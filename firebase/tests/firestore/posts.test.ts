import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const myUnverifiedAuth = { uid: myId };
const theirId = 'user_theirs';
const thirdId = 'user_third';
const postPath = 'posts/randomId';
const categoryId = 'random';
const categoryPath = `categories/${categoryId}`;
const postObject = {
  title: 'My random post',
  body: 'My post is so random that I cannot think of anything more random',
  authorId: myId,
  categoryId,
};
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

describe('posts', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(db.collection('posts').get());
    });
  });

  describe('create', () => {
    it('should only allow a categoryId that exists', async () => {
      // subcollection exists, but should still fail
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(postPath).set(postObject));
    });

    it('should allow subscribers of given category', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(postPath).set(postObject));
    });

    it('should allow moderators of given category', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(postPath).set(postObject));
    });

    it('should allow owner of given category', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      await firebase.assertSucceeds(db.doc(postPath).set(postObject));
    });

    it('should not allow a user who is not a subscriber, moderator, or owner of given category', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      await firebase.assertFails(db.doc(postPath).set(postObject));
    });

    it('should not allow unauthenticated users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const db = getFirestore();
      await firebase.assertFails(db.doc(postPath).set(postObject));
    });

    it('should not allow unverified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const db = getFirestore(myUnverifiedAuth);
      await firebase.assertFails(db.doc(postPath).set(postObject));
    });

    it('should check for required fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const { title, ...missingTitle } = postObject;
      const { body, ...missingBody } = postObject;
      const { authorId, ...missingAuthorId } = postObject;
      const { categoryId, ...missingCategoryId } = postObject;
      await firebase.assertFails(db.doc(postPath).set(missingTitle));
      await firebase.assertFails(db.doc(postPath).set(missingBody));
      await firebase.assertFails(db.doc(postPath).set(missingAuthorId));
      await firebase.assertFails(db.doc(postPath).set(missingCategoryId));
    });

    it('should not allow extra fields', async () => {
      // allowed fields: title, body, authorId, categoryId
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const extraObject = { extra: true, ...postObject };
      await firebase.assertFails(db.doc(postPath).set(extraObject));
    });

    it('should only allow title to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidTitle = { ...postObject, title: true };
      await firebase.assertFails(db.doc(postPath).set(invalidTitle));
    });

    it('should only allow title to have a length > 3', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const shortTitle = { ...postObject, title: 'a' };
      await firebase.assertFails(db.doc(postPath).set(shortTitle));
    });

    it('should only allow body to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidBody = { ...postObject, body: { text: 'wrong' } };
      await firebase.assertFails(db.doc(postPath).set(invalidBody));
    });

    it('should only allow authorId to be userId', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidAuthorId = { ...postObject, authorId: theirId };
      await firebase.assertFails(db.doc(postPath).set(invalidAuthorId));
    });
  });

  describe('update', () => {});

  describe('delete', () => {});
});
