import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { displaySignInDialog } from '../store/authSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

type ItemWithRating<T extends {}> = T & {
  loadingRating: boolean;
  ratingStatus?: 'up' | 'down';
  onUpVote: (setRating: (a: number) => void) => void;
  onDownVote: (setRating: (a: number) => void) => void;
};

type Items<T extends {}> = T & {
  itemId: string;
  rating: number;
};

const useRatingStatus = <T>(
  items: Items<T>[],
  upVoteItemIds: string[],
  downVoteItemIds: string[],
  loadingUpVoteItemIds: string[],
  loadingDownVoteItemIds: string[],
  loading: boolean,
  isFirstFetch: boolean,
  setIsFirstFetch: (payload: boolean) => {
    payload: boolean;
    type: string;
  },
  upVote: (arg: string) => AsyncThunkAction<string, string, {}>,
  downVote: (arg: string) => AsyncThunkAction<string, string, {}>,
  removeUpVote: (arg: string) => AsyncThunkAction<string, string, {}>,
  removeDownVote: (arg: string) => AsyncThunkAction<string, string, {}>,
  getVoteItemIds: (arg: string[]) => AsyncThunkAction<
    {
      upVoteItemIds: any[];
      downVoteItemIds: any[];
    },
    string[],
    {}
  >
) => {
  const [itemsWithRating, setItemsWithRating] = useState<ItemWithRating<T>[]>(
    []
  );
  const dispatch = useAppDispatch();
  const user = !!useAppSelector((state) => state.auth.user);

  // used to store the users up/down vote ids upon first load
  // used to calculate baseRating (the rating of the item stripped of the user's vote)
  // baseRating is used to update rating upon voting without having to fetch again
  const baseUpVoteItemIds = useRef<string[]>([]);
  const baseDownVoteItemIds = useRef<string[]>([]);

  useEffect(() => {
    dispatch(setIsFirstFetch(true));
    if (isFirstFetch) baseUpVoteItemIds.current = [...upVoteItemIds];
    if (isFirstFetch) baseDownVoteItemIds.current = [...downVoteItemIds];
    !loading && dispatch(setIsFirstFetch(false));
    //eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    setItemsWithRating(
      items.map((item, i) => {
        const { itemId, rating } = item;
        const loadingRating =
          loading ||
          [...loadingUpVoteItemIds, ...loadingDownVoteItemIds].includes(itemId);

        const baseRating =
          rating +
          (baseUpVoteItemIds.current.includes(itemId)
            ? -1
            : baseDownVoteItemIds.current.includes(itemId)
            ? 1
            : 0);

        if (!user) {
          return {
            ...item,
            loadingRating,
            onUpVote: () => dispatch(displaySignInDialog()),
            onDownVote: () => dispatch(displaySignInDialog()),
          };
        }

        if (upVoteItemIds.includes(itemId)) {
          return {
            ...item,
            ratingStatus: 'up',
            loadingRating,
            onUpVote: (setRating) => {
              dispatch(removeUpVote(itemId));
              setRating(baseRating + 0);
            },
            onDownVote: (setRating) => {
              dispatch(removeUpVote(itemId));
              dispatch(downVote(itemId));
              setRating(baseRating + -1);
            },
          };
        }

        if (downVoteItemIds.includes(itemId)) {
          return {
            ...item,
            ratingStatus: 'down',
            loadingRating,
            onUpVote: (setRating) => {
              dispatch(removeDownVote(itemId));
              dispatch(upVote(itemId));
              setRating(baseRating + 1);
            },
            onDownVote: (setRating) => {
              dispatch(removeDownVote(itemId));
              setRating(baseRating + 0);
            },
          };
        }

        return {
          ...item,
          ratingStatus: undefined,
          loadingRating,
          onUpVote: (setRating) => {
            dispatch(upVote(itemId));
            setRating(baseRating + 1);
          },
          onDownVote: (setRating) => {
            dispatch(downVote(itemId));
            setRating(baseRating + -1);
          },
        };
      })
    );

    //eslint-disable-next-line
  }, [
    items,
    upVoteItemIds,
    downVoteItemIds,
    loading,
    loadingUpVoteItemIds,
    loadingDownVoteItemIds,
  ]);

  /* load votes if user signs in/out, or items change */
  useEffect(() => {
    if (items.length) {
      const itemIds = items.map(({ itemId }) => itemId);
      dispatch(getVoteItemIds(itemIds));
    }
    //eslint-disable-next-line
  }, [user, items]);

  return {
    itemsWithRating: itemsWithRating.length
      ? itemsWithRating
      : items.map((item) => ({
          ...item,
          ratingStatus: undefined,
          loadingRating: true,
          onUpVote: () => {},
          onDownVote: () => {},
        })),
  };
};

export default useRatingStatus;
