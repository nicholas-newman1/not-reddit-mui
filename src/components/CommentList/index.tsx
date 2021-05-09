import { List, ListItem, Typography, makeStyles } from '@material-ui/core';
import CommentContainer from '../../containers/CommentContainer';
import { Comment } from '../../types/client';
import CommentListLoading from './Loading';

const useStyles = makeStyles((theme) => ({
  item: {
    padding: 0,

    '& + &': {
      paddingTop: theme.spacing(2),
    },
  },
}));

interface Props {
  comments: Comment[];
  loading: boolean;
}

const CommentList: React.FC<Props> = ({ comments, loading }) => {
  const classes = useStyles();

  return loading ? (
    <CommentListLoading />
  ) : comments.length ? (
    <List disablePadding>
      {comments.map((comment, i) => (
        <ListItem disableGutters className={classes.item} key={i}>
          <CommentContainer comment={comment} />
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography component='p' variant='h6' paragraph>
      No Comments Found
    </Typography>
  );
};

export default CommentList;
