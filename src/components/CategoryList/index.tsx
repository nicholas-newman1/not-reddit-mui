import { makeStyles, List, ListItem } from '@material-ui/core';
import React from 'react';
import CategoryListing from '../CategoryListing';
import CategoryListLoading from './Loading';

const useStyles = makeStyles((theme) => ({
  item: {
    padding: 0,

    '& + &': {
      paddingTop: theme.spacing(2),
    },
  },
}));

interface Props {
  categories: {
    categoryId: string;
    numOfSubscribers: number;
    onToggleSubscribe: () => void;
    categoryHref: string;
    subscribed: boolean;
    loading: boolean;
  }[];
  loading: boolean;
}

const CategoryList: React.FC<Props> = ({ categories, loading }) => {
  const classes = useStyles();

  return loading ? (
    <CategoryListLoading />
  ) : (
    <List disablePadding>
      {categories.map((category) => (
        <ListItem
          disableGutters
          className={classes.item}
          key={category.categoryId}
        >
          <CategoryListing {...category} />
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryList;
