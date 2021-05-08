import { useEffect, useState } from 'react';
import { displaySignInDialog } from '../store/authSlice';
import {
  getVotePostIds,
  removeUpVote,
  upVote,
  downVote,
  removeDownVote,
} from '../store/ratingStatusSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

interface Post {
  title: string;
  body: string;
  authorId: string;
  authorUsername: string;
  categoryId: string;
  postId: string;
  edited: boolean;
  rating: number;
  timestamp: number;
  postHref: string;
  authorProfileHref: string;
  categoryHref: string;
  numOfComments: number;
}

interface PostWithRating extends Post {
  loadingRating: boolean;
  ratingStatus?: 'up' | 'down';
  onUpVote: () => void;
  onDownVote: () => void;
}

const useRatingStatus = (posts: Post[]) => {
  const [postsWithRating, setPostsWithRating] = useState<PostWithRating[]>([]);
  const dispatch = useAppDispatch();
  const user = !!useAppSelector((state) => state.auth.user);
  const {
    upVotePostIds,
    downVotePostIds,
    loadingUpVotePostIds,
    loadingDownVotePostIds,
    loading,
  } = useAppSelector((state) => state.ratingStatus);

  useEffect(() => {
    setPostsWithRating(
      posts.map((post) => {
        const { postId, title } = post;
        const loadingRating =
          loading ||
          [...loadingUpVotePostIds, ...loadingDownVotePostIds].includes(postId);

        if (!user) {
          return {
            ...post,
            loadingRating,
            onUpVote: () => dispatch(displaySignInDialog()),
            onDownVote: () => dispatch(displaySignInDialog()),
          };
        }

        if (upVotePostIds.includes(postId)) {
          return {
            ...post,
            ratingStatus: 'up',
            loadingRating,
            onUpVote: () => dispatch(removeUpVote(postId)),
            onDownVote: () => {
              dispatch(removeUpVote(postId));
              dispatch(downVote({ postId, title }));
            },
          };
        }

        if (downVotePostIds.includes(postId)) {
          return {
            ...post,
            ratingStatus: 'down',
            loadingRating,
            onUpVote: () => {
              dispatch(removeDownVote(postId));
              dispatch(upVote({ postId, title }));
            },
            onDownVote: () => dispatch(removeDownVote(postId)),
          };
        }

        return {
          ...post,
          ratingStatus: undefined,
          loadingRating,
          onUpVote: () => dispatch(upVote({ postId, title })),
          onDownVote: () => dispatch(downVote({ postId, title })),
        };
      })
    );

    //eslint-disable-next-line
  }, [
    upVotePostIds,
    downVotePostIds,
    loading,
    loadingUpVotePostIds,
    loadingDownVotePostIds,
  ]);

  /* load votes if user signs in/out, or posts change */
  useEffect(() => {
    if (posts.length) {
      const postIds = posts.map(({ postId }) => postId);
      dispatch(getVotePostIds(postIds));
    }
    //eslint-disable-next-line
  }, [user, posts]);

  return { postsWithRating };
};

export default useRatingStatus;
