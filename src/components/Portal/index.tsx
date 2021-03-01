import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  container?: HTMLElement;
}

const Portal: React.FC<Props> = ({ children, container }) => {
  return ReactDOM.createPortal(children, container || document.body);
};

export default Portal;
