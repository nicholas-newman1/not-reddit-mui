import React from 'react';
import Modal from '../Modal';
import styles from './Drawer.module.scss';

interface Props {
  open: boolean;
  onClose?: () => any;
}

/* Drawer is an extension of the Modal component. It adds some styles to look
like a drawer */

const Drawer: React.FC<Props> = ({ children, open, onClose = () => {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.drawer}>{children}</div>
    </Modal>
  );
};

export default Drawer;
