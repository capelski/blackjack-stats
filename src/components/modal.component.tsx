import { PropsWithChildren, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import { modalParamName, useSearchParamsUtils } from '../search-params-utils';

export type BaseModalProps = PropsWithChildren<{
  id: string;
}>;

export const BaseModal: React.FC<BaseModalProps> = props => {
  const { deleteParameter, getParameter } = useSearchParamsUtils();
  const isModalOpen = getParameter(modalParamName) === props.id;

  const closeModal = useCallback(() => {
    deleteParameter(modalParamName);
  }, [deleteParameter]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen, closeModal]);

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      {props.children}
    </Modal>
  );
};
