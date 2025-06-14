
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface AgentStatusGridProps {
  agents: Agent[];
  getAgentStatus: (agentId: string, candidateIndex: number) => 'completed' | 'processing' | 'pending';
  totalCandidates: number;
}

const AgentStatusGrid = ({ agents, getAgentStatus, totalCandidates }: AgentStatusGridProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {agents.map((agent) => (
        <Card key={agent.id} className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              {agent.icon}
              <span>{agent.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
            
            <div className="space-y-2">
              {Array.from({ length: Math.min(totalCandidates, 5) }, (_, index) => {
                const status = getAgentStatus(agent.id, index);
                return (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500">Candidate {index + 1}:</span>
                    {status === 'completed' ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </div>
                    ) : status === 'processing' ? (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Processing</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {totalCandidates > 5 && (
                <div className="text-xs text-gray-400">
                  ...and {totalCandidates - 5} more candidates
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AgentStatusGrid;
