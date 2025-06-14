
import type { CandidateAnalysis } from "@/types/candidates";
import { Badge } from "@/components/ui/badge";
import { NameUtils } from "@/utils/resume/nameUtils"; // Import name cleaner

interface CandidateDetailHeaderProps {
  analysis: CandidateAnalysis;
}

const getFitBadgeColor = (fit: string) => {
  switch (fit) {
    case 'Excellent': return 'bg-green-100 text-green-800';
    case 'Good': return 'bg-blue-100 text-blue-800';
    case 'Fair': return 'bg-yellow-100 text-yellow-800';
    case 'Poor': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CandidateDetailHeader = ({ analysis }: CandidateDetailHeaderProps) => {
  if (!analysis) return null;
  /* Always clean candidate name before displaying to enforce removal of 'Resume.pdf', '.pdf', 'Resume' etc. */
  const cleanedName = NameUtils.cleanName(analysis.candidate.name);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 md:space-x-4">
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {cleanedName}
        </div>
        <div className="flex items-center mt-1 space-x-2">
          <Badge className={`text-xs ${getFitBadgeColor(analysis.overallFit)}`}>
            {analysis.overallFit} Fit
          </Badge>
          <span className="text-sm text-gray-500">Rank {analysis.rank}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-xl text-blue-600">
          {analysis.scores.overall}%
        </span>
        <span className="hidden md:block text-gray-500">Overall Score</span>
      </div>
    </div>
  );
};

export default CandidateDetailHeader;
