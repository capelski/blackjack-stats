import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getOverridesResolver } from '../logic/decision-overrides.logic';
import { getStrategy } from '../logic/strategy.logic';
import { hit, stand } from '../models/action.model';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Strategy } from '../types/strategy.type';

export type StandThresholdPageProps = {
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  softStandThreshold: number;
  setSoftStandThreshold: (standThreshold: number) => void;
  standThreshold: number;
  setStandThreshold: (standThreshold: number) => void;
};

export const StandThresholdPage: React.FC<StandThresholdPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (
    threshold: number,
    softThreshold: number,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputing(true);

    const standThresholdResolver: HandResolver = hand => {
      const thresholdToUse = hand.scores.length > 1 ? softThreshold : threshold;
      return hand.effectiveScore >= thresholdToUse ? stand : hit;
    };

    const handResolver = getOverridesResolver(standThresholdResolver, decisionOverrides);

    // Deliberately ignoring the app rules, as the stand threshold strategy doesn't depend on them
    const strategy = await getStrategy({}, handResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.standThreshold, props.softStandThreshold, props.decisionOverrides);
  }, [props.decisionOverrides, props.softStandThreshold, props.standThreshold]);

  return (
    <StrategyContext.Provider
      value={{
        computing,
        decisionOverrides: props.decisionOverrides,
        onDecisionOverride: props.onDecisionOverride,
        showBetMultiplier: false,
        strategy,
      }}
    >
      <StrategyLayoutComponent title={t('titles.standThreshold')}>
        <StandThresholdControl
          disabled={computing}
          label={t('standThreshold.label')}
          onChange={props.setStandThreshold}
          value={props.standThreshold}
        />
        <StandThresholdControl
          disabled={computing}
          label={t('standThreshold.softLabel')}
          onChange={props.setSoftStandThreshold}
          value={props.softStandThreshold}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
