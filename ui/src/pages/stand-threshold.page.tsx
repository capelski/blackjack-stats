import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StandThresholdControl } from '../components/stand-threshold-control.component';
import { StrategyLayoutComponent } from '../components/strategy-layout.component';
import { getStrategy } from '../logic/strategy.logic';
import { hit, stand } from '../models/action.model';
import { StrategyContext } from '../strategy.context';
import { HandResolver } from '../types/hand-resolution.type';
import { Strategy } from '../types/strategy.type';

export type StandThresholdPageProps = {
  standThreshold: number;
  setStandThreshold: (standThreshold: number) => void;
};

export const StandThresholdPage: React.FC<StandThresholdPageProps> = props => {
  const { t } = useTranslation();
  const [computing, setComputing] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>(undefined!);

  const computeStrategy = async (threshold: number) => {
    setComputing(true);
    const handResolver: HandResolver = hand => {
      return hand.effectiveScore >= threshold ? stand : hit;
    };

    const strategy = await getStrategy({}, handResolver);
    setStrategy(strategy);
    setComputing(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeStrategy(props.standThreshold);
  }, [props.standThreshold]);

  return (
    <StrategyContext.Provider value={{ computing, showBetMultiplier: false, strategy }}>
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
