import { Fade, Modal as MUIModal } from '@mui/material';
import React, { ReactElement } from 'react';

const modalStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <MUIModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      style={modalStyles}
    >
      <Fade in={open}>{children}</Fade>
    </MUIModal>
  );
};

export default Modal;
