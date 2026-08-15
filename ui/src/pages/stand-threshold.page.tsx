import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { StrategyContext } from '../strategy.context';
import { DecisionOverrideHandler, DecisionOverridesMap } from '../types/decision-overrides.type';
import { Rules } from '../types/rules.type';
import { StandThresholds } from '../types/stand-thresholds.type';
import { Strategy } from '../types/strategy.type';

export type StandThresholdPageProps = {
  computing: boolean;
  decisionOverrides: DecisionOverridesMap;
  onDecisionOverride: DecisionOverrideHandler;
  rules: Rules;
  setStandThresholds: (standThresholds: StandThresholds) => void;
  standThresholds: StandThresholds;
  strategy: Strategy;
};

export const StandThresholdPage: React.FC<StandThresholdPageProps> = props => {
  const { t } = useTranslation();
  const [sameThresholdForSoftScores, setSameThresholdForSoftScores] = useState(
    props.standThresholds.softScores === props.standThresholds.regular,
  );

  return (
    <LoadingOverlay loading={props.computing || !props.strategy}>
      <StrategyContext.Provider
        value={{
          decisionOverrides: props.decisionOverrides,
          onDecisionOverride: props.onDecisionOverride,
          rules: props.rules,
          showBetMultiplier: false,
          strategy: props.strategy,
        }}
      >
        <StrategyLayoutComponent title={t('titles.standThreshold')}>
          <p>
            <StandThresholdControl
              disabled={props.computing}
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
                disabled={props.computing}
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
                disabled={props.computing}
                name="soft-threshold-mode"
                onChange={() => setSameThresholdForSoftScores(false)}
                type="radio"
              />
            </span>
            <StandThresholdControl
              disabled={props.computing || sameThresholdForSoftScores}
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
    </LoadingOverlay>
  );
};
