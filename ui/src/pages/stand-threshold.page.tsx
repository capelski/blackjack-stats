import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { dealerFinalScores } from '../logic/dealer-data.logic';
import { getOverridesResolver } from '../logic/decision-overrides.logic';
import { getStrategy } from '../logic/strategy.logic';
import { hit, stand } from '../models/action.model';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { HandResolver } from '../types/hand-resolution.type';
import { Rules } from '../types/rules.type';
import { StandThresholds } from '../types/stand-thresholds.type';
import { Strategy } from '../types/strategy.type';

// Deliberately ignoring the app rules, as the stand threshold strategy doesn't depend on them
const standThresholdRules: Rules = {};

export type StandThresholdPageProps = {
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  setStandThresholds: (standThresholds: StandThresholds) => void;
  standThresholds: StandThresholds;
};

export const StandThresholdPage: React.FC<StandThresholdPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [sameThresholdForSoftScores, setSameThresholdForSoftScores] = useState(
    props.standThresholds.softScores === props.standThresholds.regular,
  );
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (
    thresholds: StandThresholds,
    decisionOverrides: DecisionOverridesMap,
  ) => {
    setComputing(true);

    const standThresholdResolver: HandResolver = hand => {
      const thresholdToUse = hand.scores.length > 1 ? thresholds.softScores : thresholds.regular;
      return hand.effectiveScore >= thresholdToUse ? stand : hit;
    };

    const handResolver = getOverridesResolver(standThresholdResolver, decisionOverrides);

    const strategy = await getStrategy(standThresholdRules, handResolver, dealerFinalScores);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.standThresholds, props.decisionOverrides);
  }, [props.decisionOverrides, props.standThresholds]);

  return (
    <StrategyContext.Provider
      value={{
        computing,
        decisionOverrides: props.decisionOverrides,
        onDecisionOverride: props.onDecisionOverride,
        rules: standThresholdRules,
        showBetMultiplier: false,
        strategy,
      }}
    >
      <StrategyLayoutComponent title={t('titles.standThreshold')}>
        <p>
          <StandThresholdControl
            disabled={computing}
            label={t('standThreshold.label')}
            onChange={value => {
              props.setStandThresholds({
                regular: value,
                softScores: sameThresholdForSoftScores ? value : props.standThresholds.softScores,
              });
            }}
            value={props.standThresholds.regular}
          />
        </p>
        <p>
          {t('standThreshold.softLabel')}:{' '}
          <span>
            <input
              checked={sameThresholdForSoftScores}
              disabled={computing}
              name="soft-threshold-mode"
              onChange={() => {
                setSameThresholdForSoftScores(true);
                props.setStandThresholds({
                  regular: props.standThresholds.regular,
                  softScores: props.standThresholds.regular,
                });
              }}
              type="radio"
            />{' '}
            {t('standThreshold.sameThreshold')}
          </span>
          <span>
            <input
              checked={!sameThresholdForSoftScores}
              disabled={computing}
              name="soft-threshold-mode"
              onChange={() => setSameThresholdForSoftScores(false)}
              type="radio"
            />
          </span>
          <StandThresholdControl
            disabled={computing || sameThresholdForSoftScores}
            onChange={value => {
              props.setStandThresholds({
                regular: props.standThresholds.regular,
                softScores: Number(value),
              });
            }}
            value={props.standThresholds.softScores}
          />
        </p>
      </StrategyLayoutComponent>
    </StrategyContext.Provider>
  );
};
