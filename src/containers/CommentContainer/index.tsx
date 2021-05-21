import React, { useEffect, useState } from 'react';
import Comment from '../../components/Comment';
import { db } from '../../services/firebase';
import { DBComment } from '../../types/db';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import { displaySignInDialog } from '../../store/authSlice';
import { subscribeToCategory } from '../../store/subscribedCategoriesSlice';
import { Comment as CommentType } from '../../types/client';

interface Props {
  comment: CommentType;
  isReply?: boolean;
}

const CommentContainer: React.FC<Props> = ({ comment, isReply }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>(comment.replies);
  const [gotReplies, setGotReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [numOfComments, setNumOfComments] = useState(comment.numOfComments);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleted, setDeleted] = useState(comment.deleted);
  const [error, setError] =
    useState<undefined | { type?: string; message?: string }>();
  const [ratingStatus, setRatingStatus] = useState<'up' | 'down' | undefined>();
  const [loadingRatingStatus, setLoadingRatingStatus] = useState(true);
  const { subscribed, loading } = useSubscribedCategoryIds();
  const [onUpVote, setOnUpVote] = useState<() => void>(() => {});
  const [onDownVote, setOnDownVote] = useState<() => void>(() => {});
  const [rating, setRating] = useState(comment.rating);

  const getRatingStatus = async () => {
    setLoadingRatingStatus(true);
    const upVoteSnap = await db
      .collectionGroup('upVoteIds')
      .where('commentId', '==', comment.commentId)
      .where('uid', '==', user?.uid)
      .get();

    const downVoteSnap = await db
      .collectionGroup('downVoteIds')
      .where('commentId', '==', comment.commentId)
      .where('uid', '==', user?.uid)
      .get();

    if (upVoteSnap.docs.length) setRatingStatus('up');
    if (downVoteSnap.docs.length) setRatingStatus('down');
    setLoadingRatingStatus(false);
  };

  const upVote = () => {
    if (!user) return dispatch(displaySignInDialog());
    db.doc(`${comment.path}/upVoteIds/${user.uid}`).set({
      commentId: comment.commentId,
      uid: user.uid,
    });
  };

  const removeUpVote = () => {
    if (!user) return dispatch(displaySignInDialog());
    db.doc(`${comment.path}/upVoteIds/${user.uid}`).delete();
  };

  const downVote = () => {
    if (!user) return dispatch(displaySignInDialog());
    db.doc(`${comment.path}/downVoteIds/${user.uid}`).set({
      commentId: comment.commentId,
      uid: user.uid,
    });
  };

  const removeDownVote = () => {
    if (!user) return dispatch(displaySignInDialog());
    db.doc(`${comment.path}/downVoteIds/${user.uid}`).delete();
  };

  useEffect(() => {
    getRatingStatus();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!user) {
      setOnUpVote(() => () => dispatch(displaySignInDialog()));
      setOnDownVote(() => () => dispatch(displaySignInDialog()));
      return;
    }

    if (ratingStatus === 'up') {
      setOnUpVote(() => () => {
        removeUpVote();
        setRatingStatus(undefined);
        setRating((prev) => prev - 1);
      });

      setOnDownVote(() => () => {
        removeUpVote();
        downVote();
        setRatingStatus('down');
        setRating((prev) => prev - 2);
      });

      return;
    }

    if (ratingStatus === 'down') {
      setOnUpVote(() => () => {
        removeDownVote();
        upVote();
        setRatingStatus('up');
        setRating((prev) => prev + 2);
      });

      setOnDownVote(() => () => {
        removeDownVote();
        setRatingStatus(undefined);
        setRating((prev) => prev + 1);
      });

      return;
    }

    setOnUpVote(() => () => {
      upVote();
      setRatingStatus('up');
      setRating((prev) => prev + 1);
    });

    setOnDownVote(() => () => {
      downVote();
      setRatingStatus('down');
      setRating((prev) => prev - 1);
    });
    //eslint-disable-next-line
  }, [ratingStatus, user]);

  const getReplies = async () => {
    setLoadingReplies(true);
    const snap = await db
      .collection(`${comment.path}/comments`)
      .orderBy('timestamp', 'desc')
      .get();
    const comments = snap.docs.map((doc) => {
      const data = doc.data() as DBComment;
      return {
        ...data,
        timestamp: data.timestamp.seconds,
        replies: [] as CommentType[],
        path: doc.ref.path,
        authorProfileHref: `/profiles/${data.authorId}`,
        isAuthor: user?.uid === data.authorId,
        commentId: doc.id,
      };
    });
    setReplies(comments);
    setGotReplies(true);
    setLoadingReplies(false);
  };

  const hideReplies = () => {
    setReplies([]);
    setGotReplies(false);
  };

  const onReply = async (body: string) => {
    if (!user) return setError({ type: 'auth' });
    if (!subscribed(comment.categoryId)) return setError({ type: 'subscribe' });

    setLoadingReply(true);
    try {
      const ref = await db
        .collection(`${comment.path}/comments`)
        .add({ body, authorId: user.uid });
      const doc = await db.doc(`${comment.path}/comments/${ref.id}`).get();
      const data = doc.data() as DBComment;
      setReplies((prev) => [
        {
          ...data,
          timestamp: Date.now() / 1000,
          replies: [] as CommentType[],
          path: doc.ref.path,
          authorProfileHref: `/profiles/${user.uid}`,
          isAuthor: true,
          commentId: doc.id,
        },
        ...prev,
      ]);
      setNumOfComments((prev) => prev + 1);
      setReplying(false);
    } finally {
      setLoadingReply(false);
    }
  };

  const onDelete = () => {
    setLoadingDelete(true);
    comment.numOfComments
      ? db
          .doc(comment.path)
          .update({ deleted: true })
          .then(() => {
            setLoadingDelete(false);
            setDeleted(true);
          })
          .catch((err) => {
            setLoadingDelete(false);
          })
      : db
          .doc(comment.path)
          .delete()
          .then(() => {
            setLoadingDelete(false);
            setDeleted(true);
          })
          .catch((err) => {
            setLoadingDelete(false);
          });
  };

  return (
    <Comment
      {...comment}
      numOfComments={numOfComments}
      replying={replying}
      setReplying={setReplying}
      replies={replies}
      ratingStatus={ratingStatus}
      rating={rating}
      onUpVote={onUpVote}
      onDownVote={onDownVote}
      onReplies={() => (gotReplies ? hideReplies() : getReplies())}
      onReport={() => {}}
      onReply={onReply}
      onDelete={onDelete}
      loadingRating={loadingRatingStatus}
      loadingReply={loadingReply}
      loadingReplies={loadingReplies}
      loadingDelete={loadingDelete}
      gotReplies={gotReplies}
      isReply={isReply}
      onSignIn={() => dispatch(displaySignInDialog())}
      onSubscribe={(clearErrors: () => void) =>
        dispatch(subscribeToCategory(comment.categoryId)).then(() =>
          clearErrors()
        )
      }
      loadingSubscribe={loading(comment.categoryId)}
      error={error}
      deleted={deleted}
    />
  );
};

export default CommentContainer;
