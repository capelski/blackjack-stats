import { effectiveScoreToLabel } from '../logic/labels.logic';
import { toPercentage } from '../logic/numbers.logic';
import { useStrategyContext } from '../strategy.context';
import { FinalScoresListItem } from './final-scores-list-item.component';

export const FinalScoresList: React.FC = () => {
  const { finalScores } = useStrategyContext();

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
        ></FinalScoresListItem>
      ))}
    </div>
  );
};
