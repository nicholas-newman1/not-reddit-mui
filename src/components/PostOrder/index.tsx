import { Button, ButtonGroup, Grid } from '@material-ui/core';
import React from 'react';

interface Props {
  buttons: {
    label: string;
    onClick: () => void;
    disabled: boolean;
  }[];
}

const PostOrder: React.FC<Props> = ({ buttons }) => {
  return (
    <Grid>
      <ButtonGroup>
        {buttons.map((button) => (
          <Button
            key={button.label}
            variant={button.disabled ? 'contained' : 'outlined'}
            disabled={button.disabled}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </Grid>
  );
};

export default PostOrder;
