
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsHeaderProps {
  jobTitle: string;
  department?: string;
  candidateCount: number;
}

const ResultsHeader = ({ jobTitle, department, candidateCount }: ResultsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Start New Analysis
            </Button>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">LangGraph Analysis Complete</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Analysis Results</h1>
          <p className="text-xl text-gray-600">Top {candidateCount} candidates for {jobTitle} ranked by our multi-agent system</p>
          {department && (
            <p className="text-lg text-gray-500">Department: {department}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultsHeader;
