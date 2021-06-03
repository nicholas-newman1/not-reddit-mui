import React, { useEffect } from 'react';
import CategoryMeta from '../../components/CategoryMeta';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import { getCategoryMeta } from '../../store/categoryMetaSlice';

interface Props {
  categoryId: string;
}

const CategoryMetaContainer: React.FC<Props> = ({ categoryId }) => {
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const uid = useAppSelector((state) => state.auth.user?.uid);
  const { categoryMeta, categoryMetaLoading } = useAppSelector(
    (state) => state.categoryMeta
  );

  const {
    onToggleSubscribe,
    loading: loadingToggleSubscribe,
    subscribed,
  } = useSubscribedCategoryIds();

  useEffect(() => {
    if (!loadingUser) {
      (!categoryMeta || categoryMeta.categoryId !== categoryId) &&
        dispatch(getCategoryMeta(categoryId));
    }
    //eslint-disable-next-line
  }, [categoryId, loadingUser]);

  return (
    <CategoryMeta
      categoryHref={`/categories/${categoryMeta.categoryId}`}
      categoryName={categoryMeta.categoryId}
      isOwner={categoryMeta.owner.uid === uid}
      owner={categoryMeta.owner}
      numOfModerators={categoryMeta.numOfModerators || 0}
      numOfSubscribers={categoryMeta.numOfSubscribers || 0}
      onToggleSubscribe={() => onToggleSubscribe(categoryId)}
      loadingToggleSubscribe={loadingToggleSubscribe(categoryId)}
      loading={categoryMetaLoading}
      subscribed={subscribed(categoryId)}
    />
  );
};

export default CategoryMetaContainer;
