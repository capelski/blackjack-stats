import { PropsWithChildren, useEffect } from 'react';
import Modal from 'react-modal';
import { useSearchParams } from 'react-router-dom';

export const modalQueryParamName = 'modal-id';

export type BaseModalProps = PropsWithChildren<{
  id: string;
}>;

export const BaseModal: React.FC<BaseModalProps> = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isModalOpen = searchParams.get(modalQueryParamName) === props.id;

  const closeModal = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(modalQueryParamName);
    setSearchParams(nextSearchParams);
  };

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
  }, [searchParams]);

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      {props.children}
    </Modal>
  );
};
