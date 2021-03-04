import React from 'react';
import styled from 'styled-components';

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;

  & li {
    margin: 1rem;
  }
`;

const CardMenu: React.FC = ({ children }) => {
  return (
    <nav>
      <List>{children}</List>
    </nav>
  );
};

export default CardMenu;
