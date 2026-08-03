import React from 'react';
import { useTranslation } from 'react-i18next';
import { Action } from '../models/action.model';
import { selectedActionParamName, useSearchParamsUtils } from '../search-params-utils';

/** Title of an action breakdown section, along with a button to deep link to it */
export const ActionsBreakdownTitle: React.FC<{ action: Action }> = ({ action }) => {
  const { t } = useTranslation();
  const { setParameter } = useSearchParamsUtils();

  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
      <h3>{t(`actions.${action}`)}</h3>

      <span
        onClick={() => {
          setParameter(selectedActionParamName, action);
        }}
        style={{ cursor: 'pointer' }}
      >
        🔗
      </span>
    </div>
  );
};
