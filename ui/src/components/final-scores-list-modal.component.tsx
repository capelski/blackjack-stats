import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaterialHand } from '../types/material-hand.type';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { HandsListProps } from './material-hands-list-item.component';
import { BaseModal } from './modal.component';

type FinalScoresListModalProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: MaterialHand[];
  score: string;
};

export const FinalScoresListModal: React.FC<FinalScoresListModalProps> = props => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <span>
      <button onClick={() => setIsModalOpen(true)}>{t('finalScoresList.view')}</button>

      <BaseModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <h3>{props.score}</h3>
        <MaterialHandsListCore
          hands={props.hands}
          hideAction={true}
          hideScore={true}
          showBetMultiplier={props.showBetMultiplier}
        />
      </BaseModal>
    </span>
  );
};
