import { PropsWithChildren, useEffect } from 'react';
import Modal from 'react-modal';

export type BaseModalProps = PropsWithChildren<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}>;

export const BaseModal: React.FC<BaseModalProps> = props => {
  const onClose = () => {
    props.setIsModalOpen(false);
  };

  useEffect(() => {
    if (!props.isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.isModalOpen]);

  return (
    <Modal isOpen={props.isModalOpen} onRequestClose={onClose}>
      {props.children}
    </Modal>
  );
};
