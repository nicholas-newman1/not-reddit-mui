import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const myUnverifiedAuth = { uid: myId };
const theirId = 'user_theirs';
const categoryId = 'meditation';
const categoryPath = `categories/${categoryId}`;
const postId = '82ghn0830f31vsntj';
const postPath = `posts/${postId}`;
const post = {
  title: 'My random post',
  body: 'My post is so random that I cannot think of anything more random',
  authorId: myId,
  categoryId,
};
const theirPost = {
  ...post,
  authorId: theirId,
};
const commentPath = 'comments/generatedId';
const comment = {
  authorId: myId,
  postId,
  body: 'This is a really important comment',
};
const otherCommentId = '2172nf2494';
const otherCommentPath = `comments/${otherCommentId}`;
const otherComment = {
  ...comment,
  body: 'This is a different comment!',
};
const theirComment = {
  ...comment,
  authorId: theirId,
};

const theirOtherComment = {
  ...otherComment,
  authorId: theirId,
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

describe('comments', () => {
  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(db.collection('comments').get());
    });
  });

  describe('create', () => {
    it('should allow subscribers of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).set(comment));
    });

    it('should allow moderators of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).set(comment));
    });

    it('should allow owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(db.doc(commentPath).set(comment));
    });

    it('should not allow users banned from category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).set(comment));
    });

    it('should not allow a user who is not a subscriber, moderator, or owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(commentPath).set(comment));
    });

    it('should not allow a postId that does not exist', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const nonPost = { ...comment, postId: postId + 'bvwqo8ybg' };
      await firebase.assertFails(db.doc(commentPath).set(nonPost));
    });

    it('should not allow unverified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const db = getFirestore(myUnverifiedAuth);
      await firebase.assertFails(db.doc(commentPath).set(comment));
    });

    it('should check for required fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const { authorId, ...missingAuthorId } = comment;
      const { postId, ...missingPostId } = comment;
      const { body, ...missingBody } = comment;
      await firebase.assertFails(db.doc(commentPath).set(missingAuthorId));
      await firebase.assertFails(db.doc(commentPath).set(missingPostId));
      await firebase.assertFails(db.doc(commentPath).set(missingBody));
    });

    it('should allow the optional field: repliesTo', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(otherCommentPath).set(theirComment);
      await firebase.assertSucceeds(
        db.doc(commentPath).set({ ...comment, repliesTo: otherCommentId })
      );
    });

    it('should not allow repliesTo to be a comment id that does not exist', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(
        db.doc(commentPath).set({ ...comment, repliesTo: otherCommentId })
      );
    });

    it('should not allow extra fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(
        db.doc(commentPath).set({ ...comment, badField: true })
      );
    });

    it('should not allow authorId != userId', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).set(theirComment));
    });

    it('should only allow body to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidBody = { ...comment, body: { i: 'am not a string' } };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });

    it('should not allow a body without length', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidBody = { ...comment, body: '' };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });
  });

  describe('update', () => {
    it('should allow author', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      await firebase.assertSucceeds(db.doc(commentPath).set(otherComment));
    });

    it('should allow moderators of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(commentPath).set(theirComment);
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).set(theirOtherComment));
    });

    it('should allow owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertSucceeds(db.doc(commentPath).set(theirOtherComment));
    });

    it('should not allow users banned from category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).set(otherComment));
    });

    it('should not allow !author, or !moderator/owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(commentPath).set(theirOtherComment));
    });

    it('should only allow body to be changed', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      const invalidComment = { ...comment, authorId: theirId };
      await firebase.assertFails(db.doc(commentPath).set(invalidComment));
    });

    it('should only allow body to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      const invalidBody = { ...comment, body: false };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });

    it('should not allow a body without length', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      const invalidBody = { ...comment, body: '' };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });
  });

  describe('delete', () => {
    it('should allow author', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      await firebase.assertSucceeds(db.doc(commentPath).delete());
    });

    it('should allow moderators of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(commentPath).set(theirComment);
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).delete());
    });

    it('should allow owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertSucceeds(db.doc(commentPath).delete());
    });

    it('should not allow users banned category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(comment);
      admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).delete());
    });

    it('should not allow !author, or !moderator/owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(commentPath).delete());
    });

    it('should not allow unverified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const db = getFirestore(myUnverifiedAuth);
      await firebase.assertFails(db.doc(commentPath).delete());
    });
  });
});
