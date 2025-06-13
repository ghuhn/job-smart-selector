
import { Card, CardContent } from "@/components/ui/card";
import { Award, TrendingUp, User, Brain } from "lucide-react";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";

interface SummaryCardsProps {
  candidates: CandidateAnalysis[];
}

const SummaryCards = ({ candidates }: SummaryCardsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{candidates.length}</div>
          <p className="text-gray-600">Top Candidates</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{candidates[0]?.scores.overall || 0}%</div>
          <p className="text-gray-600">Best Match Score</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {JSON.parse(localStorage.getItem('uploadedResumes') || '[]').length}
          </div>
          <p className="text-gray-600">Resumes Analyzed</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
          <p className="text-gray-600">AI Agents Used</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
