import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
const admin = firebase.initializeApp();
const db = admin.firestore();

exports.categoryCreated = functions.firestore
  .document('categories/{categoryId}')
  .onCreate((snap) => {
    const data = snap.data();
    const id = snap.id;
    db.doc(`categories/${id}`).set({
      ...data,
      numOfSubscribers: 0,
      numOfModerators: 0,
    });
  });

const updateNumOfSubscribers = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const category = snap.ref.parent.parent;
  const id = category?.id;
  const data = (await category?.get())?.data();

  if (id && data) {
    const numOfSubscribers = decrease
      ? data.numOfSubscribers - 1
      : data.numOfSubscribers + 1;
    db.doc(`categories/${id}`).set({ ...data, numOfSubscribers });
  }
};

exports.subscriberCreated = functions.firestore
  .document('categories/{categoryId}/subscriberIds/{subscriberId}')
  .onCreate((snap) => {
    updateNumOfSubscribers(snap);
  });

exports.subscriberDeleted = functions.firestore
  .document('categories/{categoryId}/subscriberIds/{subscriberId}')
  .onDelete((snap) => {
    updateNumOfSubscribers(snap, true);
  });

const updateNumOfModerators = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const category = snap.ref.parent.parent;
  const id = category?.id;
  const data = (await category?.get())?.data();
  if (id && data) {
    const numOfModerators = decrease
      ? data.numOfModerators - 1
      : data.numOfModerators + 1;
    db.doc(`categories/${id}`).set({ ...data, numOfModerators });
  }
};

exports.moderatorCreated = functions.firestore
  .document('categories/{categoryId}/moderatorIds/{moderatorId}')
  .onCreate((snap) => {
    updateNumOfModerators(snap);
  });

exports.moderatorDeleted = functions.firestore
  .document('categories/{categoryId}/moderatorIds/{moderatorId}')
  .onDelete((snap) => {
    updateNumOfModerators(snap, true);
  });

exports.postCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const id = snap.id;
    const authorUsername = (await db.doc(`users/${data.authorId}`).get()).data()
      ?.username;
    const postData = {
      ...data,
      rating: 0,
      edited: false,
      authorUsername:
        authorUsername && typeof authorUsername === 'string'
          ? authorUsername
          : null,
    };
    db.doc(`posts/${id}`).set(postData);
  });

exports.postUpdated = functions.firestore
  .document('posts/{postId}')
  .onUpdate((snap) => {
    const before = snap.before.data();
    const after = snap.after.data();
    const id = snap.after.id;

    if (before.title != after.title || before.body != after.body) {
      db.doc(`posts/${id}`).set({ ...after, edited: true });
    }
  });

const updatePostRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const post = snap.ref.parent.parent;
  const id = post?.id;
  const data = (await post?.get())?.data();
  if (id && data) {
    const rating = decrease ? data.rating - 1 : data.rating + 1;
    db.doc(`posts/${id}`).set({ ...data, rating });
  }
};

exports.postUpVoteCreated = functions.firestore
  .document('posts/{postId}/upVoteIds/{upVoteId}')
  .onCreate((snap) => {
    updatePostRating(snap);
  });

exports.postDownVoteCreated = functions.firestore
  .document('posts/{postId}/downVoteIds/{downVoteId}')
  .onCreate((snap) => {
    updatePostRating(snap, true);
  });

exports.postUpVoteDeleted = functions.firestore
  .document('posts/{postId}/upVoteIds/{upVoteId}')
  .onDelete((snap) => {
    updatePostRating(snap, true);
  });

exports.postDownVoteDeleted = functions.firestore
  .document('posts/{postId}/downVoteIds/{downVoteId}')
  .onDelete((snap) => {
    updatePostRating(snap);
  });

exports.commentCreated = functions.firestore
  .document('comments/{commentId}')
  .onCreate((snap) => {
    const data = snap.data();
    const id = snap.id;
    db.doc(`comments/${id}`).set({ ...data, rating: 0, edited: false });
  });

exports.commentUpdated = functions.firestore
  .document('comments/{commentId}')
  .onUpdate((snap) => {
    const before = snap.before.data();
    const after = snap.after.data();
    const id = snap.after.id;

    if (before.body != after.body) {
      db.doc(`comments/${id}`).set({ ...after, edited: true });
    }
  });

const updateCommentRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const comment = snap.ref.parent.parent;
  const id = comment?.id;
  const data = (await comment?.get())?.data();
  if (id && data) {
    const rating = decrease ? data.rating - 1 : data.rating + 1;
    db.doc(`comments/${id}`).set({ ...data, rating });
  }
};

exports.commentUpVoteCreated = functions.firestore
  .document('comments/{commentId}/upVoteIds/{upVoteId}')
  .onCreate((snap) => {
    updateCommentRating(snap);
  });

exports.commentDownVoteCreated = functions.firestore
  .document('comments/{commentId}/downVoteIds/{downVoteId}')
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });

exports.commentUpVoteDeleted = functions.firestore
  .document('comments/{commentId}/upVoteIds/{upVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });

exports.commentDownVoteDeleted = functions.firestore
  .document('comments/{commentId}/downVoteIds/{downVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
