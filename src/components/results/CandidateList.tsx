
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, MapPin, Code } from "lucide-react";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";

interface CandidateListProps {
  candidates: CandidateAnalysis[];
  selectedCandidate: number;
  onSelectCandidate: (index: number) => void;
  onDownloadProfile: (index: number) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getFitBadgeColor = (fit: string) => {
  switch (fit) {
    case 'Excellent': return 'bg-green-100 text-green-800';
    case 'Good': return 'bg-blue-100 text-blue-800';
    case 'Fair': return 'bg-yellow-100 text-yellow-800';
    case 'Poor': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CandidateList = ({ candidates, selectedCandidate, onSelectCandidate, onDownloadProfile }: CandidateListProps) => {
  return (
    <div className="lg:col-span-1 space-y-4">
      {candidates.map((analysis, index) => (
        <Card
          key={index}
          className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
            selectedCandidate === index
              ? 'bg-blue-50 ring-2 ring-blue-500'
              : 'bg-white/60 backdrop-blur-sm hover:bg-white/80'
          }`}
          onClick={() => onSelectCandidate(index)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  analysis.rank === 1 ? 'bg-yellow-500' :
                  analysis.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                }`}>
                  {analysis.rank}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{analysis.candidate.name}</h3>
                  <p className="text-sm text-gray-600">{analysis.candidate.experience} experience</p>
                  <Badge className={`text-xs mt-1 ${getFitBadgeColor(analysis.overallFit)}`}>
                    {analysis.overallFit} Fit
                  </Badge>
                </div>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                {analysis.scores.overall}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {analysis.candidate.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {analysis.candidate.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Code className="h-4 w-4 mr-2" />
                {analysis.candidate.technicalSkills.slice(0, 3).join(', ')}
                {analysis.candidate.technicalSkills.length > 3 && '...'}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadProfile(index);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CandidateList;
