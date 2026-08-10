import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { playerLabelUrlParam } from '../../constants';
import { getActionableHands } from '../logic/abstract-hands.logic';
import { urlParamToLabel } from '../logic/labels.logic';
import { double, hit, split, stand } from '../models/action.model';
import { selectedActionParamName, useSearchParamsUtils } from '../search-params-utils';
import { useStrategyContext } from '../strategy.context';
import { ActionsBreakdownNextCard } from './actions-breakdown-next-card.component';
import { ActionsBreakdownStand } from './actions-breakdown-stand.component';

/** Sections that can be scrolled into view through the section search parameter */
type BreakdownSection = typeof double | typeof hit | typeof split | typeof stand;
const breakdownSections: BreakdownSection[] = [stand, hit, double, split];

export const ActionsBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { getParameter } = useSearchParamsUtils();
  const { strategy } = useStrategyContext();
  const params = useParams();

  const doubleRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const standRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<BreakdownSection, React.RefObject<HTMLDivElement | null>> = {
    [double]: doubleRef,
    [hit]: hitRef,
    [split]: splitRef,
    [stand]: standRef,
  };

  const rawPlayerLabel = params[playerLabelUrlParam];
  const playerLabel = rawPlayerLabel && urlParamToLabel(rawPlayerLabel);

  const resolvedHand = getActionableHands(strategy.resolvedHandsList).find(
    resolvedHand => resolvedHand.label === playerLabel,
  );

  // Anchoring through the URL hash doesn't work, because the sections are rendered only once
  // the strategy has been computed (i.e. after the browser navigation has completed)
  const section = getParameter(selectedActionParamName, breakdownSections);
  const sectionRef = section ? sectionRefs[section] : undefined;

  useEffect(() => {
    if (sectionRef && resolvedHand) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [resolvedHand, sectionRef]);

  return (
    <div className="actions-breakdown">
      {resolvedHand ? (
        <React.Fragment>
          <ActionsBreakdownStand
            dealerScores={strategy.dealerScores}
            resolvedHand={resolvedHand}
            sectionRef={standRef}
          />
          <ActionsBreakdownNextCard action={hit} resolvedHand={resolvedHand} sectionRef={hitRef} />
          {resolvedHand.canDouble && (
            <ActionsBreakdownNextCard
              action={double}
              resolvedHand={resolvedHand}
              sectionRef={doubleRef}
            />
          )}
          {resolvedHand.canSplit && (
            <ActionsBreakdownNextCard
              action={split}
              resolvedHand={resolvedHand}
              sectionRef={splitRef}
            />
          )}
        </React.Fragment>
      ) : (
        <h3>{t('actionsBreakdown.notFound', { label: playerLabel })}</h3>
      )}
    </div>
  );
};
