import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../app.context';
import { LoadingOverlay } from '../components/loading-overlay.component';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { StrategyContext } from '../strategy.context';

export const StandThresholdPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    standThreshold: { computing, onDecisionOverride, rules, setThresholds, strategy, thresholds },
  } = useAppContext();
  const [sameThresholdForSoftScores, setSameThresholdForSoftScores] = useState(
    thresholds.softScores === thresholds.regular,
  );

  return (
    <LoadingOverlay loading={computing || !strategy}>
      <StrategyContext.Provider
        value={{ onDecisionOverride, rules, showBetMultiplier: false, strategy }}
      >
        <StrategyLayoutComponent title={t('titles.standThreshold')}>
          <p>
            <StandThresholdControl
              disabled={computing}
              label={t('standThreshold.label')}
              onChange={value => {
                setThresholds({
                  regular: value,
                  softScores: sameThresholdForSoftScores ? value : thresholds.softScores,
                });
              }}
              value={thresholds.regular}
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
                  setThresholds({
                    regular: thresholds.regular,
                    softScores: thresholds.regular,
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
                setThresholds({
                  regular: thresholds.regular,
                  softScores: Number(value),
                });
              }}
              value={thresholds.softScores}
            />
          </p>
        </StrategyLayoutComponent>
      </StrategyContext.Provider>
    </LoadingOverlay>
  );
};
