import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.text};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 1rem;
`;

type Props = React.ComponentProps<typeof StyledCard>;

const Card: React.FC<Props> = (props) => {
  return (
    <StyledCard {...props} data-testid='wrapper'>
      {props.children}
    </StyledCard>
  );
};

export default Card;
