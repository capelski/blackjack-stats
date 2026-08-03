import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { playerLabelUrlParam } from '../../constants';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { urlParamToLabel } from '../logic/labels.logic';
import { useStrategyContext } from '../strategy.context';
import { ActionsBreakdownHit } from './actions-breakdown-hit.component';
import { ActionsBreakdownStand } from './actions-breakdown-stand.component';

export const ActionsBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { strategy } = useStrategyContext();
  const params = useParams();

  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  const resolvedHand = getActionableHands(strategy.resolvedHandsList).find(
    resolvedHand => resolvedHand.label === playerLabel,
  );

  return (
    <div className="actions-breakdown">
      {resolvedHand ? (
        <React.Fragment>
          <ActionsBreakdownStand resolvedHand={resolvedHand} />
          <ActionsBreakdownHit resolvedHand={resolvedHand} />
        </React.Fragment>
      ) : (
        <h3>{t('actionsBreakdown.notFound', { label: playerLabel })}</h3>
      )}
    </div>
  );
};
