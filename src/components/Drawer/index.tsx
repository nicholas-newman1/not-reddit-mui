import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

interface Props {
  open: boolean;
  onClose?: () => any;
}

/* Drawer is an extension of the Modal component. It adds some styles to look
like a drawer */

const StyledDrawer = styled.div`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  height: 100vh;
  max-width: 300px;
  overflow: hidden;
`;

const Drawer: React.FC<Props> = ({ children, open, onClose = () => {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledDrawer>{children}</StyledDrawer>
    </Modal>
  );
};

export default Drawer;
