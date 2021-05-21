import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const myUnverifiedAuth = { uid: myId };
const theirId = 'user_theirs';
const categoryId = 'meditation';
const categoryPath = `categories/${categoryId}`;
const postId = '82ghn0830f31vsntj';
const postPath = `posts/${postId}`;
const post = { authorId: myId, categoryId };
const theirPost = { ...post, authorId: theirId };
const commentId = 'comment1';
const commentPath = `${postPath}/comments/${commentId}`;
const nestedCommentId = 'comment2';
const nestedCommentPath = `${postPath}/comments/${commentId}/comments/${nestedCommentId}`;
const otherComment = { body: 'This is a different comment!' };
const myComment = { body: 'comment', authorId: myId };
const theirComment = { body: 'comment', authorId: theirId };

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
      await firebase.assertSucceeds(db.doc(commentPath).get());
    });
  });

  describe('create', () => {
    it('should allow subscribers of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).set(myComment));
    });

    it('should allow moderators of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).set(myComment));
    });

    it('should allow owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(db.doc(commentPath).set(myComment));
    });

    it('should not allow users banned from category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).set(myComment));
    });

    it('should not allow a user who is not a subscriber, moderator, or owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(commentPath).set(myComment));
    });

    it('should not allow a postId that does not exist', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(`posts/1/comments/1`).set(myComment));
    });

    it('should not allow unverified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const db = getFirestore(myUnverifiedAuth);
      await firebase.assertFails(db.doc(commentPath).set(myComment));
    });

    it('should check for required fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const { body, ...missingBody } = myComment;
      await firebase.assertFails(db.doc(commentPath).set(missingBody));
    });

    it('should not allow extra fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      await firebase.assertFails(
        db.doc(commentPath).set({ ...myComment, badField: true })
      );
    });

    it('should only allow body to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidBody = { ...myComment, body: { i: 'am not a string' } };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });

    it('should not allow a body without length', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      const invalidBody = { ...myComment, body: '' };
      await firebase.assertFails(db.doc(commentPath).set(invalidBody));
    });
  });

  describe('update', () => {
    it('should allow author', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
      await firebase.assertSucceeds(db.doc(commentPath).update(otherComment));
    });

    it('should allow moderators of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(commentPath).set(theirComment);
      admin.doc(`${categoryPath}/moderatorIds/${myId}`).set({ exists: true });
      await firebase.assertSucceeds(db.doc(commentPath).update(otherComment));
    });

    it('should allow owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: myId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertSucceeds(db.doc(commentPath).update(otherComment));
    });

    it('should not allow users banned from category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
      admin.doc(`${categoryPath}/bannedIds/${myId}`).set({ exists: true });
      await firebase.assertFails(db.doc(commentPath).update(otherComment));
    });

    it('should not allow !author, or !moderator/owner of category of post', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(commentPath).update(otherComment));
    });

    it('should only allow body to be changed', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
      await firebase.assertFails(db.doc(commentPath).update(theirComment));
    });

    it('should only allow body to be a string', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
      const invalidBody = { ...myComment, body: false };
      await firebase.assertFails(db.doc(commentPath).update(invalidBody));
    });

    it('should not allow a body without length', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
      const invalidBody = { ...myComment, body: '' };
      await firebase.assertFails(db.doc(commentPath).update(invalidBody));
    });
  });

  describe('delete', () => {
    it('should allow author', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(postPath).set(theirPost);
      admin.doc(`${categoryPath}/subscriberIds/${myId}`).set({ exists: true });
      admin.doc(commentPath).set(myComment);
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
      admin.doc(commentPath).set(myComment);
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

describe('comments/upVoteIds', () => {
  const upVotePath = `${commentPath}/upVoteIds/${myId}`;
  const theirUpVotePath = `${commentPath}/upVoteIds/${theirId}`;
  const nestedUpVotePath = `${nestedCommentPath}/upVoteIds/${myId}`;

  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(
        db.collection(`${commentPath}/upVoteIds`).get()
      );
    });
  });

  describe('create', () => {
    it('should allow verified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertSucceeds(
        db.doc(upVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow document id to be different from user id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(theirUpVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow documents without uid', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(upVotePath).set({ commentId }));
    });

    it('should not allow documents without commentId', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(upVotePath).set({ uid: myId }));
    });

    it('should not allow uid to be different from doc Id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: theirId, commentId })
      );
    });

    it('should not allow commentId to be different', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: myId, commentId: commentId + '123' })
      );
    });

    it('should not allow extra fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: myId, commentId, noob: true })
      );
    });

    it('should allow on nested comments', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(nestedCommentPath).set(theirComment);
      await firebase.assertSucceeds(
        db.doc(nestedUpVotePath).set({ uid: myId, commentId: nestedCommentId })
      );
    });
  });

  describe('delete', () => {
    it('should allow verified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(upVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(upVotePath).delete());
    });

    it('should allow on nested comment', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(nestedUpVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(nestedUpVotePath).delete());
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(upVotePath).set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(upVotePath).delete());
    });

    it('should not allow document id to be different from user id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(theirUpVotePath).set({ uid: theirId, categoryId });
      await firebase.assertFails(db.doc(theirUpVotePath).delete());
    });
  });
});

describe('comments/downVoteIds', () => {
  const downVotePath = `${commentPath}/downVoteIds/${myId}`;
  const theirDownVotePath = `${commentPath}/downVoteIds/${theirId}`;
  const nestedDownVotePath = `${nestedCommentPath}/downVoteIds/${myId}`;

  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(
        db.collection(`${commentPath}/downVoteIds`).get()
      );
    });
  });

  describe('create', () => {
    it('should allow verified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertSucceeds(
        db.doc(downVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow document id to be different from user id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(theirDownVotePath).set({ uid: myId, commentId })
      );
    });

    it('should not allow documents without uid', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(downVotePath).set({ commentId }));
    });

    it('should not allow documents without commentId', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(db.doc(downVotePath).set({ uid: myId }));
    });

    it('should not allow uid to be different from doc Id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: theirId, commentId })
      );
    });

    it('should not allow commentId to be different', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, commentId: commentId + '123' })
      );
    });

    it('should not allow extra fields', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, commentId, noob: true })
      );
    });

    it('should allow on nested comments', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(nestedCommentPath).set(theirComment);
      await firebase.assertSucceeds(
        db
          .doc(nestedDownVotePath)
          .set({ uid: myId, commentId: nestedCommentId })
      );
    });
  });

  describe('delete', () => {
    it('should allow verified users', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(downVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(downVotePath).delete());
    });

    it('should allow on nested comment', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(nestedDownVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(nestedDownVotePath).delete());
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(downVotePath).set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(downVotePath).delete());
    });

    it('should not allow document id to be different from user id', async () => {
      admin.doc(categoryPath).set({ ownerId: theirId });
      admin.doc(commentPath).set(theirComment);
      admin.doc(theirDownVotePath).set({ uid: theirId, categoryId });
      await firebase.assertFails(db.doc(theirDownVotePath).delete());
    });
  });
});
