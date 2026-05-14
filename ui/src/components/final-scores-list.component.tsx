import { getFinalScoresTotals } from '../logic/final-scores-list.logic';
import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { FinalScoresListItem } from './final-scores-list-item.component';

export const FinalScoresList: React.FC = () => {
  const { strategy, showBetMultiplier } = useStrategyContext();
  const { totalHands, totalProbability } = getFinalScoresTotals(strategy.finalScores);

  return (
    <div className="final-scores-list">
      <p>Number of final scores: {strategy.finalScores.length}</p>

      <FinalScoresListItem
        hands="Hands"
        isHeader={true}
        probability="Probability"
        score="Score"
      ></FinalScoresListItem>

      {strategy.finalScores.map((finalScore, index) => (
        <FinalScoresListItem
          hands={finalScore.hands}
          key={index}
          probability={toPercentage(finalScore.probability)}
          score={effectiveScoreToLabel(finalScore.score)}
          showBetMultiplier={showBetMultiplier}
        ></FinalScoresListItem>
      ))}

      <FinalScoresListItem
        hands={String(totalHands)}
        isHeader={true}
        probability={toPercentage(totalProbability)}
        score="Total"
      ></FinalScoresListItem>
    </div>
  );
};
