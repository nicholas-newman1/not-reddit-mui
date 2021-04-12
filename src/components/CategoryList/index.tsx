import { makeStyles, List, ListItem } from '@material-ui/core';
import React from 'react';
import CategoryListing from '../CategoryListing';

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
    <h2>Loading...</h2>
  ) : (
    <List disablePadding>
      {categories.map((category) => (
        <ListItem disableGutters className={classes.item}>
          <CategoryListing {...category} />
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryList;
