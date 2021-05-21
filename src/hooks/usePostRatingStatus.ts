import { useMemo } from 'react';
import {
  getVotePostIds,
  removeUpVote,
  upVote,
  downVote,
  removeDownVote,
  setIsFirstFetch,
} from '../store/ratingStatusSlice';
import { Post } from '../types/client';
import { useAppSelector } from './useAppSelector';
import useRatingStatus from './useRatingStatus';

const usePostRatingStatus = (posts: Post[]) => {
  const {
    upVotePostIds,
    downVotePostIds,
    loadingUpVotePostIds,
    loadingDownVotePostIds,
    loading,
    isFirstFetch,
  } = useAppSelector((state) => state.ratingStatus);

  const items = useMemo(
    () => posts.map((post) => ({ ...post, itemId: post.postId })),
    [posts]
  );

  const { itemsWithRating } = useRatingStatus(
    items,
    upVotePostIds,
    downVotePostIds,
    loadingUpVotePostIds,
    loadingDownVotePostIds,
    loading,
    isFirstFetch,
    setIsFirstFetch,
    upVote,
    downVote,
    removeUpVote,
    removeDownVote,
    getVotePostIds
  );

  return {
    postsWithRating: itemsWithRating,
  };
};

export default usePostRatingStatus;
