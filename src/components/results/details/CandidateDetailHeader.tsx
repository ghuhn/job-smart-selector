
import { Badge } from "@/components/ui/badge";
import type { CandidateAnalysis } from "@/types/candidates";
import { getFitBadgeColor, getScoreBg, getScoreColor } from "./utils";

interface CandidateDetailHeaderProps {
  analysis: CandidateAnalysis;
}

const CandidateDetailHeader = ({ analysis }: CandidateDetailHeaderProps) => (
  <div className="text-2xl flex items-center justify-between">
    <span>{analysis.candidate.name}</span>
    <div className="flex items-center space-x-2">
      <Badge className={`text-lg px-3 py-1 ${getFitBadgeColor(analysis.overallFit)}`}>
        {analysis.overallFit} Fit
      </Badge>
      <Badge className={`text-lg px-3 py-1 ${getScoreBg(analysis.scores.overall)} ${getScoreColor(analysis.scores.overall)}`}>
        Rank #{analysis.rank}
      </Badge>
    </div>
  </div>
);

export default CandidateDetailHeader;
