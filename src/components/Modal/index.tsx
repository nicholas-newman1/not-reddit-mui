import React from 'react';
import Portal from '../Portal';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  onClose?: () => any;
}

const Modal: React.FC<Props> = ({ children, open, onClose }) => {
  return open ? (
    <Portal>
      <div className={styles.wrapper} data-testid='wrapper'>
        <div
          className={styles.background}
          onClick={onClose}
          data-testid='background'
        />
        <div>{children}</div>
      </div>
    </Portal>
  ) : null;
};

export default Modal;
