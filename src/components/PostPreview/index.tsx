import {
  Grid,
  makeStyles,
  Button,
  Paper,
  Typography,
  Link as StyledLink,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import PostMeta from '../PostMeta';
import Rating from '../Rating';

interface Props {
  onUpVote: () => void;
  onDownVote: () => void;
  onSave: () => void;
  onShare: () => void;
  onReport: () => void;
  postHref: string;
  commentsHref: string;
  userProfileHref: string;
  categoryHref: string;
  title: string;
  username: string;
  timestamp: number;
  category: string;
  numOfComments: number;
  rating: number;
  ratingStatus?: 'up' | 'down';
}

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);
  const layoutSpacing = theme.spacing(1.5);

  return {
    root: {
      padding: layoutSpacing,
    },
    gap: {
      gap: layoutSpacing,
      marginLeft: layoutSpacing,
    },
    buttonGroup: {
      margin: `-${buttonSpacing}px`,
    },
    button: {
      paddingLeft: buttonSpacing,
      paddingRight: buttonSpacing,
      minHeight: 0,
      minWidth: 0,
      fontSize: '0.75rem',
      fontWeight: theme.typography.fontWeightBold,
    },
  };
});

const PostPreview: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Grid container direction='row' alignItems='center' wrap='nowrap'>
        <Grid item justify='center'>
          <Rating
            rating={props.rating}
            onUpVote={props.onUpVote}
            onDownVote={props.onDownVote}
            status={props.ratingStatus}
          />
        </Grid>
        <Grid item container direction='column' className={classes.gap}>
          <Grid item>
            <PostMeta
              category={props.category}
              categoryHref={props.categoryHref}
              timestamp={props.timestamp}
              userProfileHref={props.userProfileHref}
              username={props.username}
            />
          </Grid>

          <Grid item>
            <Typography component='h2' variant='body1'>
              <StyledLink
                component={Link}
                to={props.postHref}
                color='textPrimary'
              >
                {props.title}
              </StyledLink>
            </Typography>
          </Grid>

          <Grid item container className={classes.buttonGroup}>
            <Button
              className={classes.button}
              component={Link}
              to={props.postHref + '#comments'}
            >
              comments ({props.numOfComments})
            </Button>
            <Button className={classes.button} onClick={props.onSave}>
              Save
            </Button>
            <Button className={classes.button} onClick={props.onShare}>
              Share
            </Button>
            <Button className={classes.button} onClick={props.onReport}>
              Report
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostPreview;
