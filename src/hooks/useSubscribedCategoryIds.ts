import { useEffect } from 'react';
import { displaySignInDialog } from '../store/authSlice';
import {
  clearSubscribedCategoryIds,
  getSubscribedCategoryIds,
  subscribeToCategory,
  unsubscribeFromCategory,
} from '../store/subscribedCategoriesSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

const useSubscribedCategoryIds = () => {
  const dispatch = useAppDispatch();
  const user = !!useAppSelector((state) => state.auth.user);
  const subscribedCategoryIds = useAppSelector(
    (state) => state.subscribedCategories.subscribedIds
  );
  const subscribedCategoryIdsLoading = useAppSelector(
    (state) => state.subscribedCategories.loading
  );
  const subscribedCategoryIdsLoadingIds = useAppSelector(
    (state) => state.subscribedCategories.loadingIds
  );
  const onToggleSubscribe = (categoryId: string) => {
    if (!user) return dispatch(displaySignInDialog());
    subscribedCategoryIds.includes(categoryId)
      ? dispatch(unsubscribeFromCategory(categoryId))
      : dispatch(subscribeToCategory(categoryId));
  };
  const loading = (categoryId: string) =>
    subscribedCategoryIdsLoading ||
    subscribedCategoryIdsLoadingIds.includes(categoryId);
  const subscribed = (categoryId: string) =>
    subscribedCategoryIds.includes(categoryId);

  /* load subscribedCategoryIds if user signs in/out */
  useEffect(() => {
    if (user) {
      console.log('dispatch getSubscribedCategoryIds');
      !subscribedCategoryIds.length && dispatch(getSubscribedCategoryIds());
    } else {
      dispatch(clearSubscribedCategoryIds());
    }
    //eslint-disable-next-line
  }, [user]);

  return { onToggleSubscribe, loading, subscribed, subscribedCategoryIds };
};

export default useSubscribedCategoryIds;
