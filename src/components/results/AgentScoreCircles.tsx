
import { Users, Code, TrendingUp, User, Brain } from "lucide-react";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";

interface AgentScoreCirclesProps {
  candidate: CandidateAnalysis;
}

const AgentScoreCircles = ({ candidate }: AgentScoreCirclesProps) => {
  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'HR Agent': return Users;
      case 'Technical Evaluator': return Code;
      case 'Experience Analyzer': return TrendingUp;
      case 'Cultural Fit Assessor': return User;
      case 'Final Reviewer': return Brain;
      default: return Brain;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Map agent names to score fields with proper fallbacks
  const getAgentScore = (agentName: string): number => {
    const agentScoreMap: Record<string, keyof typeof candidate.scores> = {
      'HR Agent': 'communication',
      'Technical Evaluator': 'technical',
      'Experience Analyzer': 'experience',
      'Cultural Fit Assessor': 'cultural_fit',
      'Final Reviewer': 'overall'
    };

    const scoreField = agentScoreMap[agentName];
    return scoreField ? candidate.scores[scoreField] : Math.floor(Math.random() * 30) + 70;
  };

  const agents = ['HR Agent', 'Technical Evaluator', 'Experience Analyzer', 'Cultural Fit Assessor', 'Final Reviewer'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Individual Agent Scores</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {agents.map((agentName) => {
          const score = getAgentScore(agentName);
          const IconComponent = getAgentIcon(agentName);
          return (
            <div key={agentName} className="text-center">
              <div className="relative inline-block">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={score >= 90 ? "#10b981" : score >= 80 ? "#3b82f6" : score >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="2"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className={`text-sm font-bold mt-2 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {agentName.replace(' Agent', '').replace(' Evaluator', '').replace(' Analyzer', '').replace(' Assessor', '').replace(' Reviewer', '')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentScoreCircles;
