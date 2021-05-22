import * as firebase from '@firebase/rules-unit-testing';
import firebaseApp from 'firebase/app';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
const PROJECT_ID = 'not-reddit-5a7e3';
const myId = 'user_mine';
const myAuth = { uid: myId, email_verified: true };
const myUnverifiedAuth = { uid: myId };
const theirId = 'user_theirs';
const thirdId = 'user_third';
const postId = 'randomId123';
const postPath = `posts/${postId}`;
const categoryId = 'random';
const categoryPath = `categories/${categoryId}`;
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
    it('should allow subscribers of given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(postPath).set(post));
    });

    it('should allow moderators of given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/moderatorIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(postPath).set(post));
    });

    it('should allow owner of given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: myId });
      await firebase.assertSucceeds(db.doc(postPath).set(post));
    });

    it('should not allow users banned from given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      admin
        .doc(`${categoryPath}/bannedIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(postPath).set(post));
    });

    it('should only allow a categoryId that exists', async () => {
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      // subscriberIds subcollection exists, but should still fail
      await firebase.assertFails(db.doc(postPath).set(post));
    });

    it('should not allow a user who is not a subscriber, moderator, or owner of given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await firebase.assertFails(db.doc(postPath).set(post));
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(postPath).set(post));
    });

    it('should check for required fields', async () => {
      const { title, ...missingTitle } = post;
      const { body, ...missingBody } = post;
      const { authorId, ...missingAuthorId } = post;
      const { categoryId, ...missingCategoryId } = post;
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(postPath).set(missingTitle));
      await firebase.assertFails(db.doc(postPath).set(missingBody));
      await firebase.assertFails(db.doc(postPath).set(missingAuthorId));
      await firebase.assertFails(db.doc(postPath).set(missingCategoryId));
    });

    it('should not allow extra fields', async () => {
      // allowed fields: title, body, authorId, categoryId
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      const extra = { extra: true, ...post };
      await firebase.assertFails(db.doc(postPath).set(extra));
    });

    it('should only allow title to be a string', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      const invalidTitle = { ...post, title: true };
      await firebase.assertFails(db.doc(postPath).set(invalidTitle));
    });

    it('should only allow title to have a length > 3', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      const shortTitle = { ...post, title: 'a' };
      await firebase.assertFails(db.doc(postPath).set(shortTitle));
    });

    it('should only allow body to be a string', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      const invalidBody = { ...post, body: { text: 'wrong' } };
      await firebase.assertFails(db.doc(postPath).set(invalidBody));
    });

    it('should only allow authorId to be userId', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      const invalidAuthorId = { ...post, authorId: theirId };
      await firebase.assertFails(db.doc(postPath).set(invalidAuthorId));
    });
  });

  describe('update', () => {
    it('should allow the author of the post', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedPost = { ...post, body: post.body + '123' };
      await firebase.assertSucceeds(db.doc(postPath).set(updatedPost));
    });

    it('should allow the moderators of the category', async () => {
      await admin.doc(categoryPath).set({ ownerId: thirdId });
      admin
        .doc(`${categoryPath}/moderatorIds/${myId}`)
        .set({ uid: myId, categoryId });
      await admin.doc(postPath).set(theirPost);
      const theirUpdatedPost = { ...theirPost, body: post.body + '123' };
      await firebase.assertSucceeds(db.doc(postPath).set(theirUpdatedPost));
    });

    it('should allow the owner of the category', async () => {
      await admin.doc(categoryPath).set({ ownerId: myId });
      await admin.doc(postPath).set(theirPost);
      const theirUpdatedPost = { ...theirPost, body: post.body + '123' };
      await firebase.assertSucceeds(db.doc(postPath).set(theirUpdatedPost));
    });

    it('should not allow users banned from given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      admin
        .doc(`${categoryPath}/bannedIds/${myId}`)
        .set({ uid: myId, categoryId });
      const updatedPost = { ...post, body: post.body + '123' };
      await firebase.assertFails(db.doc(postPath).set(updatedPost));
    });

    it('should not allow any other subscriber/user', async () => {
      await admin.doc(categoryPath).set({ ownerId: thirdId });
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      await admin.doc(postPath).set(theirPost);
      const theirUpdatedPost = { ...theirPost, body: theirPost.body + '123' };
      await firebase.assertFails(db.doc(postPath).set(theirUpdatedPost));
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedPost = { ...post, body: post.body + '123' };
      await firebase.assertFails(db.doc(postPath).set(updatedPost));
    });

    it('should allow the title to be changed', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedTitle = { ...post, title: post.title + '123' };
      await firebase.assertSucceeds(db.doc(postPath).set(updatedTitle));
    });

    it('should only allow the title to be a string', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const invalidTitle = { ...post, title: false };
      await firebase.assertFails(db.doc(postPath).set(invalidTitle));
    });

    it('should only allow a title of length > 3', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const shortTitle = { ...post, title: 'ab' };
      await firebase.assertFails(db.doc(postPath).set(shortTitle));
    });

    it('should allow the body to be changed', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedBody = { ...post, title: post.title + '123' };
      await firebase.assertSucceeds(db.doc(postPath).set(updatedBody));
    });

    it('should only allow the body to be a string', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const invalidBody = { ...post, body: true };
      await firebase.assertFails(db.doc(postPath).set(invalidBody));
    });

    it('should not allow the authorId to be changed', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedAuthor = { ...post, authorId: theirId };
      await firebase.assertFails(db.doc(postPath).set(updatedAuthor));
    });

    it('should not allow the categoryId to be changed', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const updatedCategory = { ...post, categoryId: categoryId + '123' };
      await firebase.assertFails(db.doc(postPath).set(updatedCategory));
    });

    it('should not allow extra fields to be added', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      const extraField = { ...post, extraField: 'nope' };
      await firebase.assertFails(db.doc(postPath).set(extraField));
    });
  });

  describe('delete', () => {
    it('should allow the author of post', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      await firebase.assertSucceeds(db.doc(postPath).delete());
    });

    it('should allow the moderators of the category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      admin
        .doc(`${categoryPath}/moderatorIds/${myId}`)
        .set({ uid: myId, categoryId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(db.doc(postPath).delete());
    });

    it('should allow the owner of the category', async () => {
      await admin.doc(categoryPath).set({ ownerId: myId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(db.doc(postPath).delete());
    });

    it('should not allow users banned from given category', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      admin
        .doc(`${categoryPath}/bannedIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(postPath).delete());
    });

    it('should not allow any other subscriber/user', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      admin
        .doc(`${categoryPath}/subscriberIds/${myId}`)
        .set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(postPath).delete());
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(post);
      await firebase.assertFails(db.doc(postPath).delete());
    });
  });
});

describe('posts/upVoteIds', () => {
  const upVotePath = `${postPath}/upVoteIds/${myId}`;
  const theirUpVotePath = `${postPath}/upVoteIds/${theirId}`;

  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(
        db.collection(`${postPath}/upVoteIds`).get()
      );
    });
  });

  describe('create', () => {
    it('should allow verified users', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(
        db.doc(upVotePath).set({ uid: myId, postId })
      );
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(upVotePath).set({ uid: myId, postId }));
    });

    it('should not allow document id to be different from user id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(theirUpVotePath).set({ uid: myId, postId })
      );
    });

    it('should not allow documents without uid', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(upVotePath).set({ postId }));
    });

    it('should not allow documents without postId', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(upVotePath).set({ uid: myId }));
    });

    it('should not allow uid to be different from doc Id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: theirId, postId })
      );
    });

    it('should not allow postId to be different', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: myId, postId: postId + '123' })
      );
    });

    it('should not allow extra fields', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(upVotePath).set({ uid: myId, postId, noob: true })
      );
    });
  });

  describe('delete', () => {
    it('should allow verified users', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(upVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(upVotePath).delete());
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(upVotePath).set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(upVotePath).delete());
    });

    it('should not allow document id to be different from user id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(theirUpVotePath).set({ uid: theirId, categoryId });
      await firebase.assertFails(db.doc(theirUpVotePath).delete());
    });
  });
});

describe('posts/downVoteIds', () => {
  const downVotePath = `${postPath}/downVoteIds/${myId}`;
  const theirDownVotePath = `${postPath}/downVoteIds/${theirId}`;

  describe('read', () => {
    it('should allow anyone', async () => {
      const db = getFirestore();
      await firebase.assertSucceeds(
        db.collection(`${postPath}/downVoteIds`).get()
      );
    });
  });

  describe('create', () => {
    it('should allow verified users', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertSucceeds(
        db.doc(downVotePath).set({ uid: myId, postId })
      );
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, postId })
      );
    });

    it('should not allow document id to be different from user id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(theirDownVotePath).set({ uid: myId, postId })
      );
    });

    it('should not allow documents without uid', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(downVotePath).set({ postId }));
    });

    it('should not allow documents without postId', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(db.doc(downVotePath).set({ uid: myId }));
    });

    it('should not allow uid to be different from doc Id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: theirId, postId })
      );
    });

    it('should not allow postId to be different', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, postId: postId + '123' })
      );
    });

    it('should not allow extra fields', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await firebase.assertFails(
        db.doc(downVotePath).set({ uid: myId, postId, noob: true })
      );
    });
  });

  describe('delete', () => {
    it('should allow verified users', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(downVotePath).set({ uid: myId, categoryId });
      await firebase.assertSucceeds(db.doc(downVotePath).delete());
    });

    it('should not allow unverified users', async () => {
      const db = getFirestore(myUnverifiedAuth);
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(downVotePath).set({ uid: myId, categoryId });
      await firebase.assertFails(db.doc(downVotePath).delete());
    });

    it('should not allow document id to be different from user id', async () => {
      await admin.doc(categoryPath).set({ ownerId: theirId });
      await admin.doc(postPath).set(theirPost);
      await admin.doc(theirDownVotePath).set({ uid: theirId, categoryId });
      await firebase.assertFails(db.doc(theirDownVotePath).delete());
    });
  });
});
