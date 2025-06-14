
import type { DetailedAnalysis } from "@/types/candidates";

interface DetailedAnalysisDisplayProps {
  detailedAnalysis: DetailedAnalysis;
}

const DetailedAnalysisDisplay = ({ detailedAnalysis }: DetailedAnalysisDisplayProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800">Experience Match</h4>
          <p className="text-blue-700 text-sm">{detailedAnalysis.experienceMatch}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800">Education Fit</h4>
          <p className="text-green-700 text-sm">{detailedAnalysis.educationFit}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold text-purple-800">Project Relevance</h4>
          <p className="text-purple-700 text-sm">{detailedAnalysis.projectRelevance}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-semibold text-yellow-800">Growth Potential</h4>
          <p className="text-yellow-700 text-sm">{detailedAnalysis.growthPotential}</p>
        </div>
      </div>
    </div>
  </div>
);

export default DetailedAnalysisDisplay;
