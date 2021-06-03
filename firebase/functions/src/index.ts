import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DBPost, DBUser } from '../../../src/types/db';
admin.initializeApp();
const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);

const updateNumOfSubscribers = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const category = snap.ref.parent.parent;
  const id = category?.id;
  if (!id) return;
  db.doc(`categories/${id}`).update({
    numOfSubscribers: decrease ? decrement : increment,
  });
};

const updateNumOfModerators = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const category = snap.ref.parent.parent;
  const id = category?.id;
  if (!id) return;
  db.doc(`categories/${id}`).update({
    numOfModerators: decrease ? decrement : increment,
  });
};

const updatePostRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const post = snap.ref.parent.parent;
  const id = post?.id;
  if (!id) return;
  db.doc(`posts/${id}`).update({ rating: decrease ? decrement : increment });
};

const updateCommentRating = async (
  snap: functions.firestore.QueryDocumentSnapshot,
  decrease = false
) => {
  const comment = snap.ref.parent.parent;
  if (!comment) return;
  db.doc(comment.path).update({ rating: decrease ? decrement : increment });
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
  db.doc(path).update({ numOfComments: decrease ? decrement : increment });
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
    const categoryDoc = await db.doc(`categories/${data.categoryId}`).get();
    const ownerOfCategory = categoryDoc.data()?.ownerId;
    db.doc(snap.ref.path).update({
      rating: 0,
      edited: false,
      numOfComments: 0,
      timestamp: snap.createTime,
      daysWhenPostIsLessThanWeekOld: daysWhenPostIsLessThanWeekOld(),
      authorUsername: authorUsername || '',
      ownerOfCategory,
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
      const firebaseTimestamp = after.timestamp as admin.firestore.Timestamp;
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

const commentCreate = async (
  snap: functions.firestore.QueryDocumentSnapshot
) => {
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
  const categoryDoc = await db.doc(`categories/${post.categoryId}`).get();
  const ownerOfCategory = categoryDoc.data()?.ownerId;

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
    ownerOfCategory,
  });
};

exports.commentCreated = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated2 = functions.firestore
  .document('posts/{postId}/comments/{commentId}/comments/{commentId}')
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));
exports.commentCreated8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onCreate(async (snap) => commentCreate(snap));

const commentUpdate = (
  snap: functions.Change<functions.firestore.QueryDocumentSnapshot>
) => {
  const before = snap.before.data();
  const after = snap.after.data();

  if (before.body != after.body) {
    db.doc(snap.after.ref.path).update({ edited: true });
  }
};

exports.commentUpdated = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated2 = functions.firestore
  .document('posts/{postId}/comments/{commentId}/comments/{commentId}')
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));
exports.commentUpdated8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onUpdate((snap) => commentUpdate(snap));

const commentDelete = (snap: functions.firestore.QueryDocumentSnapshot) => {
  const parentCollectionId = snap.ref.parent.id;
  if (
    parentCollectionId !== 'upVoteIds' &&
    parentCollectionId !== 'downVoteIds'
  ) {
    updateNumOfComments(snap, true);
  }
};

exports.commentDeleted = functions.firestore
  .document('posts/{postId}/comments/{commentId}')
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted2 = functions.firestore
  .document('posts/{postId}/comments/{commentId}/comments/{commentId}')
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));
exports.commentDeleted8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}'
  )
  .onDelete((snap) => commentDelete(snap));

/* CREATE COMMENT UP VOTE */

exports.commentUpVoteCreated = functions.firestore
  .document('posts/{postId}/comments/{commentId}/upVoteIds/{upVoteId}')
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated2 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });
exports.commentUpVoteCreated8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap);
  });

/* CREATE COMMENT DOWN VOTE */

exports.commentDownVoteCreated = functions.firestore
  .document('posts/{postId}/comments/{commentId}/downVoteIds/{downVoteId}')
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated2 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentDownVoteCreated8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onCreate((snap) => {
    updateCommentRating(snap, true);
  });

/* DELETE COMMENT UP VOTE */

exports.commentUpVoteDeleted = functions.firestore
  .document('posts/{postId}/comments/{commentId}/upVoteIds/{upVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted2 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });
exports.commentUpVoteDeleted8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/upVoteIds/{upVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap, true);
  });

/* DELETE COMMENT DOWN VOTE */

exports.commentDownVoteDeleted = functions.firestore
  .document('posts/{postId}/comments/{commentId}/downVoteIds/{downVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted2 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted3 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted4 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted5 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted6 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted7 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
exports.commentDownVoteDeleted8 = functions.firestore
  .document(
    'posts/{postId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/comments/{commentId}/downVoteIds/{downVoteId}'
  )
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
