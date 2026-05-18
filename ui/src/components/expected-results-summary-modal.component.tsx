import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toDecimal } from '../logic/numbers.logic';
import { useSettingsContext } from '../settings.context';
import { BaseModal } from './modal.component';

type ExpectedResultsSummaryModalProps = {
  edge: number;
};

export const ExpectedResultsSummaryModal: React.FC<ExpectedResultsSummaryModalProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const roundsToBankruptcy = 1 / -props.edge;

  return (
    <span>
      <span style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
        ℹ️
      </span>
      <BaseModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <h3>{t('expectedResults.bankruptcyTitle')}</h3>
          <p>
            {t('expectedResults.bankruptcyBody', {
              rounds: toDecimal(roundsToBankruptcy, decimals),
            })}
          </p>
          <p>
            {t('expectedResults.bankruptcyExample', {
              rounds: toDecimal(roundsToBankruptcy * 5, decimals),
            })}
          </p>
        </div>
      </BaseModal>
    </span>
  );
};
