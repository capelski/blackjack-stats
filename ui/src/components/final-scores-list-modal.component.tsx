// import { Close, Content, Description, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { HandExtended } from '../types/hand.type';
import { HandsListCore } from './hands-list-core.component';
import { HandsListProps } from './hands-list-item.component';

type FinalScoresListModalProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: HandExtended[];
  score: string;
};

export const FinalScoresListModal: React.FC<FinalScoresListModalProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  return (
    <span>
      <button onClick={() => setIsModalOpen(true)}>View</button>

      <Modal isOpen={isModalOpen} onRequestClose={onClose}>
        <h3>{props.score}</h3>
        <HandsListCore
          hands={props.hands}
          hideAction={true}
          hideLabel={true}
          showBetMultiplier={props.showBetMultiplier}
        />
      </Modal>
    </span>
  );
};
