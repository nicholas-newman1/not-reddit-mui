import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
const admin = firebase.initializeApp();
const db = admin.firestore();

exports.postCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate((snap) => {
    const data = snap.data();
    const id = snap.id;
    db.doc(`posts/${id}`).set({ ...data, rating: 0, edited: false });
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
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  const post = snap.ref.parent.parent;
  const id = post?.id;
  const data = (await post?.get())?.data();
  if (id && data) {
    const upVotes = (await db.collection(`posts/${id}/upVoteIds`).get()).size;
    const downVotes = (await db.collection(`posts/${id}/downVoteIds`).get())
      .size;
    const rating = upVotes - downVotes;
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
    updatePostRating(snap);
  });

exports.postUpVoteDeleted = functions.firestore
  .document('posts/{postId}/upVoteIds/{upVoteId}')
  .onDelete((snap) => {
    updatePostRating(snap);
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
  snap: functions.firestore.QueryDocumentSnapshot
) => {
  const comment = snap.ref.parent.parent;
  const id = comment?.id;
  const data = (await comment?.get())?.data();
  if (id && data) {
    const upVotes = (await db.collection(`comments/${id}/upVoteIds`).get())
      .size;
    const downVotes = (await db.collection(`comments/${id}/downVoteIds`).get())
      .size;
    const rating = upVotes - downVotes;
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
    updateCommentRating(snap);
  });

exports.commentUpVoteDeleted = functions.firestore
  .document('comments/{commentId}/upVoteIds/{upVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap);
  });

exports.commentDownVoteDeleted = functions.firestore
  .document('comments/{commentId}/downVoteIds/{downVoteId}')
  .onDelete((snap) => {
    updateCommentRating(snap);
  });
