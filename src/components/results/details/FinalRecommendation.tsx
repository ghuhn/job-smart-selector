
interface FinalRecommendationProps {
  recommendation: string;
}

const FinalRecommendation = ({ recommendation }: FinalRecommendationProps) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-2 text-blue-800">Final AI Recommendation</h3>
    <p className="text-blue-700">{recommendation}</p>
  </div>
);

export default FinalRecommendation;
