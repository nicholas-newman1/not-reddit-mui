import { useMemo } from 'react';
import {
  getVoteCommentIds,
  removeUpVote,
  upVote,
  downVote,
  removeDownVote,
  setIsFirstFetch,
} from '../store/commentRatingStatusSlice';
import { Comment } from '../types/client';
import { useAppSelector } from './useAppSelector';
import useRatingStatus from './useRatingStatus';

const useCommentRatingStatus = (comments: Comment[]) => {
  const {
    upVoteCommentIds,
    downVoteCommentIds,
    loadingUpVoteCommentIds,
    loadingDownVoteCommentIds,
    loading,
    isFirstFetch,
  } = useAppSelector((state) => state.commentRatingStatus);

  const items = useMemo(
    () =>
      comments.map((comment) => ({ ...comment, itemId: comment.commentId })),
    [comments]
  );

  const { itemsWithRating } = useRatingStatus(
    items,
    upVoteCommentIds,
    downVoteCommentIds,
    loadingUpVoteCommentIds,
    loadingDownVoteCommentIds,
    loading,
    isFirstFetch,
    setIsFirstFetch,
    upVote,
    downVote,
    removeUpVote,
    removeDownVote,
    getVoteCommentIds
  );

  return {
    commentsWithRating: itemsWithRating,
  };
};

export default useCommentRatingStatus;
