
import type { Scores } from "@/types/candidates";
import { getScoreColor } from "./utils";

interface ScoreAnalysisProps {
  scores: Scores;
}

const ScoreAnalysis = ({ scores }: ScoreAnalysisProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-3">Comprehensive Score Analysis</h3>
    <div className="grid md:grid-cols-2 gap-4">
      {Object.entries(scores).filter(([key]) => key !== 'overall').map(([category, score]) => (
        <div key={category}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
            <span className={`text-sm font-bold ${getScoreColor(score as number)}`}>{score as number}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${score as number}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ScoreAnalysis;
