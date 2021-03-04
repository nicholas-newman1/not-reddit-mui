import React from 'react';
import styled from 'styled-components';
import Portal from '../Portal';

interface Props {
  open: boolean;
  onClose?: () => any;
}

const Wrapper = styled.div`
  z-index: ${(props) => props.theme.zIndex.modal};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
`;

const Content = styled.div`
  position: relative;
  display: inline-block;
`;

const Modal: React.FC<Props> = ({ children, open, onClose }) => {
  return open ? (
    <Portal>
      <Wrapper data-testid='wrapper'>
        <Background onClick={onClose} data-testid='background' />
        <Content>{children}</Content>
      </Wrapper>
    </Portal>
  ) : null;
};

export default Modal;
