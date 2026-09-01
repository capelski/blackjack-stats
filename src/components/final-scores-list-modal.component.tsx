import { useTranslation } from 'react-i18next';
import { modalParamName, useSearchParamsUtils } from '../search-params-utils';
import { MaterialHand } from '../types/material-hand.type';
import { MaterialHandsListCore } from './material-hands-list-core.component';
import { BaseModal } from './modal.component';

type FinalScoresListModalProps = {
  finalScoreId: string;
  hands: MaterialHand[];
  score: string;
};

export const FinalScoresListModal: React.FC<FinalScoresListModalProps> = (props) => {
  const { t } = useTranslation();
  const { setParameter } = useSearchParamsUtils();

  const modalId = props.finalScoreId;

  const openModal = () => {
    setParameter(modalParamName, modalId);
  };

  return (
    <span>
      <button onClick={openModal}>{t('finalScoresList.viewAll')}</button>

      <BaseModal id={modalId}>
        <h3>{props.score}</h3>
        <MaterialHandsListCore hands={props.hands} hideAction={true} hideScore={true} />
      </BaseModal>
    </span>
  );
};
