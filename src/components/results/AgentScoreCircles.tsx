
import { useState } from "react";
import { Users, Code, TrendingUp, User, Brain } from "lucide-react";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface AgentScoreCirclesProps {
  candidate: CandidateAnalysis;
}

const AgentScoreCircles = ({ candidate }: AgentScoreCirclesProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

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

  const getStrokeColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

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

  const getAgentFeedback = (agentName: string) => {
    return candidate.agentFeedbacks.find(feedback => feedback.agent === agentName);
  };

  const agents = ['HR Agent', 'Technical Evaluator', 'Experience Analyzer', 'Cultural Fit Assessor', 'Final Reviewer'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Individual Agent Scores</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {agents.map((agentName) => {
          const score = getAgentScore(agentName);
          const IconComponent = getAgentIcon(agentName);
          const feedback = getAgentFeedback(agentName);
          const isSelected = selectedAgent === agentName;

          return (
            <HoverCard key={agentName}>
              <HoverCardTrigger asChild>
                <div 
                  className={`text-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedAgent(isSelected ? null : agentName)}
                >
                  <div className="relative inline-block">
                    <svg 
                      className={`w-16 h-16 transform -rotate-90 transition-all duration-300 ${
                        isSelected ? 'drop-shadow-lg' : 'hover:drop-shadow-md'
                      }`} 
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={getStrokeColor(score)}
                        strokeWidth={isSelected ? "3" : "2"}
                        strokeDasharray={`${score}, 100`}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className={`w-6 h-6 text-gray-600 transition-all duration-300 ${
                        isSelected ? 'scale-110' : ''
                      }`} />
                    </div>
                  </div>
                  <div className={`text-sm font-bold mt-2 transition-all duration-300 ${getScoreColor(score)} ${
                    isSelected ? 'scale-110' : ''
                  }`}>
                    {score}%
                  </div>
                  <div className={`text-xs text-gray-600 mt-1 transition-all duration-300 ${
                    isSelected ? 'font-semibold' : ''
                  }`}>
                    {agentName.replace(' Agent', '').replace(' Evaluator', '').replace(' Analyzer', '').replace(' Assessor', '').replace(' Reviewer', '')}
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" side="top">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center">
                      <IconComponent className="w-4 h-4 mr-2" />
                      {agentName}
                    </h4>
                    <Badge variant="outline">Confidence: {feedback?.confidence || 85}%</Badge>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <strong>Analysis:</strong>
                    <p className="mt-1">{feedback?.analysis || "Comprehensive evaluation completed with positive indicators."}</p>
                  </div>

                  {feedback?.strengths && feedback.strengths.length > 0 && (
                    <div className="text-sm">
                      <strong className="text-green-700">Key Strengths:</strong>
                      <ul className="text-green-600 ml-2 mt-1">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback?.recommendations && feedback.recommendations.length > 0 && (
                    <div className="text-sm">
                      <strong className="text-blue-700">Recommendations:</strong>
                      <ul className="text-blue-600 ml-2 mt-1">
                        {feedback.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback?.concerns && feedback.concerns.length > 0 && (
                    <div className="text-sm">
                      <strong className="text-red-700">Concerns:</strong>
                      <ul className="text-red-600 ml-2 mt-1">
                        {feedback.concerns.map((concern, index) => (
                          <li key={index}>• {concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
      
      {selectedAgent && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-800">
              {selectedAgent} - Detailed Feedback
            </h4>
            <button 
              onClick={() => setSelectedAgent(null)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✕ Close
            </button>
          </div>
          <div className="text-sm text-blue-700">
            {getAgentFeedback(selectedAgent)?.analysis || "Detailed analysis available upon request."}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentScoreCircles;
