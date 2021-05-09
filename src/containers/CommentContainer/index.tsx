import React, { useState } from 'react';
import { ErrorOption } from 'react-hook-form';
import Comment from '../../components/Comment';
import { db } from '../../firebase/client';
import { DBComment } from '../../types/db';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import {
  displaySignInDialog,
  sendEmailVerification,
} from '../../store/authSlice';
import { subscribeToCategory } from '../../store/subscribedCategoriesSlice';
import { Comment as CommentType } from '../../types/client';

interface Props {
  comment: CommentType;
  isReply?: boolean;
}

const CommentContainer: React.FC<Props> = ({ comment, isReply }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { loadingSendEmailVerification } = useAppSelector(
    (state) => state.auth
  );
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>(comment.replies);
  const [gotReplies, setGotReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [numOfComments, setNumOfComments] = useState(comment.numOfComments);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { subscribed, loading } = useSubscribedCategoryIds();

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

  const onReply = async (
    body: string,
    setError: (name: string, error: ErrorOption) => void
  ) => {
    if (!user) return setError('body', { type: 'auth', shouldFocus: false });
    if (!user?.emailVerified || false)
      return setError('body', { type: 'verify', shouldFocus: false });
    if (!subscribed(comment.categoryId))
      return setError('body', { type: 'subscribe', shouldFocus: false });

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
          timestamp: data.timestamp.seconds,
          replies: [] as CommentType[],
          path: doc.ref.path,
          authorProfileHref: `/profiles/${data.authorId}`,
          isAuthor: true,
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
    db.doc(comment.path)
      .update({ deleted: true })
      .then(() => {
        setLoadingDelete(false);
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
      onUpVote={() => {}}
      onReplies={() => (gotReplies ? hideReplies() : getReplies())}
      onDownVote={() => {}}
      onReport={() => {}}
      onReply={onReply}
      onDelete={onDelete}
      loadingRating={false}
      loadingReply={loadingReply}
      loadingReplies={loadingReplies}
      loadingDelete={loadingDelete}
      gotReplies={gotReplies}
      isReply={isReply}
      onSignIn={() => dispatch(displaySignInDialog())}
      onSendVerification={() => dispatch(sendEmailVerification())}
      onSubscribe={(clearErrors: () => void) =>
        dispatch(subscribeToCategory(comment.categoryId)).then(() =>
          clearErrors()
        )
      }
      loadingSendVerification={loadingSendEmailVerification}
      loadingSubscribe={loading(comment.categoryId)}
    />
  );
};

export default CommentContainer;
