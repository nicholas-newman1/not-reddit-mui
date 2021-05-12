import { useEffect, useRef, useState } from 'react';
import { displaySignInDialog } from '../store/authSlice';
import {
  getVotePostIds,
  removeUpVote,
  upVote,
  downVote,
  removeDownVote,
  setIsFirstFetch,
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
  onUpVote: (setRating: (a: number) => void) => void;
  onDownVote: (setRating: (a: number) => void) => void;
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
    isFirstFetch,
  } = useAppSelector((state) => state.ratingStatus);

  // used to store the users up/down vote ids upon first load
  // used to calculate baseRating (the rating of the post stripped of the user's vote)
  // baseRating is used to update rating upon voting without having to fetch again
  const baseUpVotePostIds = useRef<string[]>([]);
  const baseDownVotePostIds = useRef<string[]>([]);

  useEffect(() => {
    dispatch(setIsFirstFetch(true));
    if (isFirstFetch) baseUpVotePostIds.current = [...upVotePostIds];
    if (isFirstFetch) baseDownVotePostIds.current = [...downVotePostIds];
    !loading && dispatch(setIsFirstFetch(false));
    //eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    setPostsWithRating(
      posts.map((post, i) => {
        const { postId, title } = post;
        const loadingRating =
          loading ||
          [...loadingUpVotePostIds, ...loadingDownVotePostIds].includes(postId);

        const baseRating =
          post.rating +
          (baseUpVotePostIds.current.includes(postId)
            ? -1
            : baseDownVotePostIds.current.includes(postId)
            ? 1
            : 0);

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
            onUpVote: (setRating) => {
              dispatch(removeUpVote(postId));
              setRating(baseRating + 0);
            },
            onDownVote: (setRating) => {
              dispatch(removeUpVote(postId));
              dispatch(downVote({ postId, title }));
              setRating(baseRating + -1);
            },
          };
        }

        if (downVotePostIds.includes(postId)) {
          return {
            ...post,
            ratingStatus: 'down',
            loadingRating,
            onUpVote: (setRating) => {
              dispatch(removeDownVote(postId));
              dispatch(upVote({ postId, title }));
              setRating(baseRating + 1);
            },
            onDownVote: (setRating) => {
              dispatch(removeDownVote(postId));
              setRating(baseRating + 0);
            },
          };
        }

        return {
          ...post,
          ratingStatus: undefined,
          loadingRating,
          onUpVote: (setRating) => {
            dispatch(upVote({ postId, title }));
            setRating(baseRating + 1);
          },
          onDownVote: (setRating) => {
            dispatch(downVote({ postId, title }));
            setRating(baseRating + -1);
          },
        };
      })
    );

    //eslint-disable-next-line
  }, [
    posts,
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

  return {
    postsWithRating: postsWithRating.length
      ? postsWithRating
      : posts.map((post) => ({
          ...post,
          ratingStatus: undefined,
          loadingRating: true,
          onUpVote: () => {},
          onDownVote: () => {},
        })),
  };
};

export default useRatingStatus;
