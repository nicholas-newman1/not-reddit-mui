import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DBPost, DBUser } from '../../../src/types/db';
const admin = firebase.initializeApp();
const db = admin.firestore();

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
    db.doc(`categories/${id}`).update({ numOfSubscribers });
  }
};

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
    db.doc(`categories/${id}`).update({ numOfModerators });
  }
};

const updatePostRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const post = snap.ref.parent.parent;
  const id = post?.id;
  const data = (await post?.get())?.data();
  if (id && data) {
    const rating = decrease ? data.rating - 1 : data.rating + 1;
    db.doc(`posts/${id}`).update({ rating });
  }
};

const updateCommentRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const comment = snap.ref.parent.parent;
  const id = comment?.id;
  const data = (await comment?.get())?.data();
  if (id && data) {
    const rating = decrease ? data.rating - 1 : data.rating + 1;
    db.doc(`comments/${id}`).update({ rating });
  }
};

const daysWhenPostIsLessThanWeekOld = (timestamp: number = Date.now()) => {
  const msInOneDay = 8.64e7;
  const daysSinceEpoch = Math.floor(timestamp / msInOneDay);
  const daysWhenPostIsLessThanWeekOld = [];
  for (let i = 0; i < 7; i++) {
    daysWhenPostIsLessThanWeekOld.push(daysSinceEpoch + i);
  }
  return daysWhenPostIsLessThanWeekOld;
};

const updateNumOfComments = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const parentDocRef = snap.ref.parent.parent;
  if (!parentDocRef) return;
  const path = parentDocRef.path;
  const data = (await parentDocRef.get()).data();
  if (!data) return;
  const numOfComments = decrease
    ? data.numOfComments - 1
    : data.numOfComments + 1;
  db.doc(path).update({ numOfComments });
};

exports.categoryCreated = functions.firestore
  .document('categories/{categoryId}')
  .onCreate((snap) => {
    db.doc(snap.ref.path).update({ numOfSubscribers: 0, numOfModerators: 0 });
  });

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
    const authorDoc = await db.doc(`users/${data.authorId}`).get();
    const authorUsername = authorDoc.data()?.username;
    db.doc(snap.ref.path).update({
      rating: 0,
      edited: false,
      numOfComments: 0,
      timestamp: snap.createTime,
      daysWhenPostIsLessThanWeekOld: daysWhenPostIsLessThanWeekOld(),
      authorUsername: authorUsername || '',
    });
  });

exports.postUpdated = functions.firestore
  .document('posts/{postId}')
  .onUpdate((snap) => {
    const before = snap.before.data();
    const after = snap.after.data();
    const id = snap.after.id;

    /* if title or body is updated, set edited to true */
    if (before.title != after.title || before.body != after.body) {
      db.doc(`posts/${id}`).update({ edited: true });
    }

    /* if db admin changes timestamp, update daysWhenPostIsLessThanWeekOld */
    if (before.timestamp != after.timestamp && before.rating == after.rating) {
      const firebaseTimestamp = after.timestamp as firebase.firestore.Timestamp;
      const timestamp = firebaseTimestamp.toMillis();
      db.doc(`posts/${id}`).update({
        daysWhenPostIsLessThanWeekOld: daysWhenPostIsLessThanWeekOld(timestamp),
      });
    }
  });

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
  .document('posts/{postId}/comments/{document=**}')
  .onCreate(async (snap) => {
    const parentCollectionId = snap.ref.parent.id;
    if (
      parentCollectionId !== 'upVoteIds' &&
      parentCollectionId !== 'downVoteIds'
    ) {
      updateNumOfComments(snap);
    }

    const uid = snap.data().authorId;
    const user = (await db.doc(`users/${uid}`).get()).data() as DBUser;
    const postId = snap.ref.path.split('/')[1];
    const post = (await db.doc(`posts/${postId}`).get()).data() as DBPost;

    db.doc(snap.ref.path).update({
      authorId: uid,
      authorUsername: user.username,
      categoryId: post.categoryId,
      postId,
      rating: 0,
      edited: false,
      numOfComments: 0,
      timestamp: snap.createTime,
      deleted: false,
    });
  });

exports.commentUpdated = functions.firestore
  .document('posts/{postId}/comments/{document=**}')
  .onUpdate((snap) => {
    const before = snap.before.data();
    const after = snap.after.data();

    if (before.body != after.body) {
      db.doc(snap.after.ref.path).update({ edited: true });
    }
  });

exports.commentDeleted = functions.firestore
  .document('posts/{postId}/comments/{document=**}')
  .onDelete((snap) => {
    const parentCollectionId = snap.ref.parent.id;
    if (
      parentCollectionId !== 'upVoteIds' &&
      parentCollectionId !== 'downVoteIds'
    ) {
      updateNumOfComments(snap, true);
    }
  });

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
