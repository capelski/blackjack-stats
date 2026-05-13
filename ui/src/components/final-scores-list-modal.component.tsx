import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { MaterialHand } from '../types/material-hand.type';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { HandsListProps } from './material-hands-list-item.component';

type FinalScoresListModalProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: MaterialHand[];
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
        <MaterialHandsListCore
          hands={props.hands}
          hideAction={true}
          hideLabel={true}
          showBetMultiplier={props.showBetMultiplier}
        />
      </Modal>
    </span>
  );
};
