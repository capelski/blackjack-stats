import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getStrategy } from '../logic/strategy.logic';
import { hit, stand } from '../models/action.model';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Strategy } from '../types/strategy.type';

export type StandThresholdPageProps = {
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  standThreshold: number;
  setStandThreshold: (standThreshold: number) => void;
};

export const StandThresholdPage: React.FC<StandThresholdPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (threshold: number, decisionOverrides: DecisionOverridesMap) => {
    setComputing(true);

    const standThresholdResolver: HandResolver = hand => {
      return hand.effectiveScore >= threshold ? stand : hit;
    };

    const handResolver: HandResolver = hand => {
      const overriddenDecision = decisionOverrides[hand.labelAsInitial];

      if (overriddenDecision && hand.consequences[overriddenDecision]) {
        return overriddenDecision;
      }

      return standThresholdResolver(hand);
    };

    // Deliberately ignoring the app rules, as the stand threshold strategy doesn't depend on them
    const strategy = await getStrategy({}, handResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.standThreshold, props.decisionOverrides);
  }, [props.decisionOverrides, props.standThreshold]);

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
          onChange={props.setStandThreshold}
          value={props.standThreshold}
        />
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
