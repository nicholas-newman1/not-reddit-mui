import React, { useState } from 'react';
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
      onUpVote={() => {}}
      onDownVote={() => {}}
      onReplies={() => (gotReplies ? hideReplies() : getReplies())}
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
