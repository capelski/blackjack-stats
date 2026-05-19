import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MaterialHand } from '../types/material-hand.type';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { HandsListProps } from './material-hands-list-item.component';
import { BaseModal, modalQueryParamName } from './modal.component';

type FinalScoresListModalProps = Pick<HandsListProps, 'showBetMultiplier'> & {
  hands: MaterialHand[];
  score: string;
};

export const FinalScoresListModal: React.FC<FinalScoresListModalProps> = props => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  const modalId = props.score;
  const openModal = () => {
    setSearchParams({ [modalQueryParamName]: modalId });
  };

  return (
    <span>
      <button onClick={openModal}>{t('finalScoresList.viewAll')}</button>

      <BaseModal id={modalId}>
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
