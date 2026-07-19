import { PropsWithChildren, useCallback, useEffect } from 'react';
import Modal from 'react-modal';
import { modalQueryParamName, useSearchParamsUtils } from '../search-params-utils';

export type BaseModalProps = PropsWithChildren<{
  id: string;
}>;

export const BaseModal: React.FC<BaseModalProps> = props => {
  const { deleteParameter, searchParams } = useSearchParamsUtils();
  const isModalOpen = searchParams.get(modalQueryParamName) === props.id;

  const closeModal = useCallback(() => {
    deleteParameter(modalQueryParamName);
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
