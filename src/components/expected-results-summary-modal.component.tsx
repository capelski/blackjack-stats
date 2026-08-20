import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { toDecimal } from '../logic/numbers.logic';
import { modalParamName, useSearchParamsUtils } from '../search-params-utils';
import { useSettingsContext } from '../settings.context';
import { BaseModal } from './modal.component';

function getRandomOutcome(limit: number): number {
  const num = Math.random();
  return num < limit ? 1 : -1;
}

function getRandomResults(startingPot: number, roundsNumber: number, limit: number): number[] {
  let currentPot = startingPot;
  const randomResults = [currentPot];

  for (let i = 0; i < roundsNumber; i++) {
    currentPot += getRandomOutcome(limit);
    randomResults.push(currentPot);
  }

  return randomResults;
}

type ExpectedResultsSummaryModalProps = {
  edge: number;
};

export const ExpectedResultsSummaryModal: React.FC<ExpectedResultsSummaryModalProps> = props => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { setParameter } = useSearchParamsUtils();

  const [randomResults, setRandomResults] = useState<number[]>([]);
  const [roundsNumber, setRoundsNumber] = useState(100);
  const [startingPot, setStartingPot] = useState<number>(5);

  const roundsToBankruptcy = 1 / -props.edge;

  const chartData = randomResults.map((value, index) => ({
    round: index + 1,
    value,
  }));

  const modalId = 'simulations';

  const openModal = () => {
    setParameter(modalParamName, modalId);
  };

  return (
    <span>
      <span style={{ cursor: 'pointer' }} onClick={openModal}>
        ℹ️
      </span>
      <BaseModal id={modalId}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <h3>{t('expectedResults.bankruptcyTitle')}</h3>
          <p>
            {t('expectedResults.bankruptcyBody', {
              rounds: toDecimal(roundsToBankruptcy, decimals),
            })}
          </p>
          <p>
            {t('expectedResults.bankruptcyExample', {
              rounds: toDecimal(roundsToBankruptcy * 5, decimals),
            })}
          </p>
          <p>
            <span>
              {t('expectedResults.simulation.startingPot')}:{' '}
              <input value={startingPot} onChange={e => setStartingPot(Number(e.target.value))} />{' '}
            </span>
            <span>
              {t('expectedResults.simulation.rounds')}:{' '}
              <input value={roundsNumber} onChange={e => setRoundsNumber(Number(e.target.value))} />{' '}
            </span>
            <button
              onClick={() =>
                setRandomResults(getRandomResults(startingPot, roundsNumber, 0.5 + props.edge))
              }
            >
              {t('expectedResults.simulation.simulate')}
            </button>
          </p>

          {randomResults.length > 0 && (
            <React.Fragment>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#efefef" vertical={false} />
                  <YAxis allowDecimals={false} width={32} />
                  <Line
                    type="linear"
                    dataKey="value"
                    stroke="#1a73e8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p>
                {t('expectedResults.simulation.finalPot')}:{' '}
                {randomResults[randomResults.length - 1]}
              </p>
            </React.Fragment>
          )}
        </div>
      </BaseModal>
    </span>
  );
};
