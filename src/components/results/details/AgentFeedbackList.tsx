
import { Badge } from "@/components/ui/badge";
import type { AgentFeedback } from "@/types/candidates";
import { Users, Code } from "lucide-react";

interface AgentFeedbackListProps {
  agentFeedbacks: AgentFeedback[];
}

const AgentFeedbackList = ({ agentFeedbacks }: AgentFeedbackListProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-3">AI Agent Analysis</h3>
    <div className="space-y-4">
      {agentFeedbacks.map((feedback, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 flex items-center">
              {feedback.agent === 'HR Agent' && <Users className="h-4 w-4 mr-2" />}
              {feedback.agent === 'Technical Evaluator' && <Code className="h-4 w-4 mr-2" />}
              {feedback.agent}
            </h4>
            <Badge variant="outline">Confidence: {feedback.confidence}%</Badge>
          </div>
          <p className="text-gray-700 text-sm mb-3">{feedback.analysis}</p>
          {feedback.recommendations.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-green-700">Recommendations:</span>
              <ul className="text-sm text-green-600 ml-4">
                {feedback.recommendations.map((rec, recIndex) => <li key={recIndex}>• {rec}</li>)}
              </ul>
            </div>
          )}
          {feedback.concerns.length > 0 && (
            <div>
              <span className="text-sm font-medium text-red-700">Concerns:</span>
              <ul className="text-sm text-red-600 ml-4">
                {feedback.concerns.map(c => <li key={c}>• {c}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default AgentFeedbackList;
