import React from 'react';
import { useTranslation } from 'react-i18next';
import { DealerFinalScoresMatrix } from '../components/dealer-final-scores-matrix.component';

export const DealerCardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('titles.dealerCard')}</h1>

      <DealerFinalScoresMatrix />
    </div>
  );
};
