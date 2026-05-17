import React from 'react';
import { useTranslation } from 'react-i18next';

export type DecimalsSelectorProps = {
  decimals: number;
  onDecimalsChange: (decimals: number) => void;
};

export const DecimalsSelector: React.FC<DecimalsSelectorProps> = props => {
  const { t } = useTranslation();

  return (
    <select
      value={props.decimals}
      onChange={e => props.onDecimalsChange(Number(e.target.value))}
      style={{ marginRight: 8 }}
    >
      <option value={2}>{t('commons.decimals', { count: 2 })}</option>
      <option value={3}>{t('commons.decimals', { count: 3 })}</option>
      <option value={4}>{t('commons.decimals', { count: 4 })}</option>
    </select>
  );
};
