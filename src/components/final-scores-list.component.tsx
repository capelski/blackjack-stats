import { useTranslation } from 'react-i18next';
import { getFinalScoresTotals } from '../logic/final-scores-list.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { serializeCards } from '../logic/material-hands.logic';
import { toPercentage } from '../logic/numbers.logic';
import { useSettingsContext } from '../settings.context';
import { useStrategyContext } from '../strategy.context';
import { FinalScoresListItem } from './final-scores-list-item.component';

export const FinalScoresList: React.FC = () => {
  const { t } = useTranslation();
  const { decimals } = useSettingsContext();
  const { strategy } = useStrategyContext();
  const { totalHands, totalProbability } = getFinalScoresTotals(strategy.finalScores);

  return (
    <div className="final-scores-list">
      <p>
        {t('finalScoresList.numberOfFinalScores')}: {strategy.finalScores.length}
      </p>

      <table style={{ width: '100%' }}>
        <thead>
          <FinalScoresListItem
            betMultiplier={t('commons.betMultiplier')}
            hands={t('finalScoresList.hands')}
            isHeader={true}
            probability={t('commons.probability')}
            score={t('commons.score')}
          />
        </thead>

        <tbody>
          {strategy.finalScores.map((finalScore, index) => {
            const sliceLimit = 10;
            const sampleHands = finalScore.hands
              .sort((a, b) => a.cards.length - b.cards.length)
              .slice(0, sliceLimit)
              .filter((h) => h.cards)
              .map((h) => serializeCards(h))
              .join(' / ');
            const combinations =
              finalScore.hands.length > sliceLimit ? `${sampleHands}...` : sampleHands;
            const isSameAsPrevious =
              index > 0 && strategy.finalScores[index - 1].score === finalScore.score;

            return (
              <FinalScoresListItem
                betMultiplier={finalScore.betMultiplier}
                combinations={combinations}
                finalScoreId={finalScore.id}
                hands={finalScore.hands}
                hideScore={isSameAsPrevious}
                key={finalScore.id}
                probability={toPercentage(finalScore.probability, decimals)}
                score={effectiveScoreToLabel(finalScore.score)}
              />
            );
          })}

          <FinalScoresListItem
            betMultiplier={''}
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
