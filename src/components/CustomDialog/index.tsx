import {
  Typography,
  Card,
  Dialog,
  makeStyles,
  DialogProps,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    padding: theme.spacing(3),
    margin: '0 auto',
    overflow: 'auto',
  },
  heading: {
    marginBottom: theme.spacing(3),
  },
}));

interface Props extends DialogProps {
  onClose: () => void;
  heading: string;
}

const CustomDialog: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { heading, children, ref, title, ...rest } = props;

  return (
    <Dialog fullWidth {...rest}>
      <Card className={classes.card}>
        <Typography
          component='h1'
          variant='h4'
          align='center'
          className={classes.heading}
        >
          {heading}
        </Typography>

        {children}
      </Card>
    </Dialog>
  );
};

export default CustomDialog;
