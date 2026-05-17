import { useTranslation } from 'react-i18next';
import { getFinalScoresTotals } from '../logic/final-scores-list.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { FinalScoresListItem } from './final-scores-list-item.component';

export const FinalScoresList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { showBetMultiplier, strategy } = useStrategyContext();
  const { totalHands, totalProbability } = getFinalScoresTotals(strategy.finalScores);

  return (
    <div className="final-scores-list">
      <p>
        {t('finalScoresList.numberOfFinalScores')}: {strategy.finalScores.length}
      </p>

      <table style={{ width: '100%' }}>
        <thead>
          <FinalScoresListItem
            hands={t('finalScoresList.hands')}
            isHeader={true}
            probability={t('commons.probability')}
            score={t('commons.score')}
          />
        </thead>

        <tbody>
          {strategy.finalScores.map((finalScore, index) => (
            <FinalScoresListItem
              hands={finalScore.hands}
              key={index}
              probability={toPercentage(finalScore.probability, decimals)}
              score={effectiveScoreToLabel(finalScore.score)}
              showBetMultiplier={showBetMultiplier}
            />
          ))}

          <FinalScoresListItem
            hands={String(totalHands)}
            isHeader={true}
            probability={toPercentage(totalProbability, decimals)}
            score={t('commons.total')}
          />
        </tbody>
      </table>
    </div>
  );
};
