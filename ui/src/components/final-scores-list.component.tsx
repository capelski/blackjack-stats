import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { FinalScoresListItem } from './final-scores-list-item.component';

type FinalScoresAggregation = {
  totalHands: number;
  totalProbability: number;
};

export const FinalScoresList: React.FC = () => {
  const { finalScores, showBetMultiplier } = useStrategyContext();

  const { totalHands, totalProbability } = finalScores.reduce<FinalScoresAggregation>(
    (reduced, finalScore) => {
      reduced.totalHands += Array.isArray(finalScore.hands) ? finalScore.hands.length : 0;
      reduced.totalProbability += finalScore.probability;
      return reduced;
    },
    { totalHands: 0, totalProbability: 0 },
  );

  return (
    <div className="final-scores-list">
      <p>Number of final scores: {finalScores.length}</p>

      <FinalScoresListItem
        hands="Hands"
        isHeader={true}
        probability="Probability"
        score="Score"
      ></FinalScoresListItem>

      {finalScores.map((finalScore, index) => (
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
