
import { Star, AlertTriangle } from "lucide-react";

interface StrengthsAndConcernsProps {
  strengths: string[];
  redFlags: string[];
}

const StrengthsAndConcerns = ({ strengths, redFlags }: StrengthsAndConcernsProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
      <ul className="space-y-2">
        {strengths.map((strength, index) => (
          <li key={index} className="flex items-start">
            <Star className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{strength}</span>
          </li>
        ))}
      </ul>
    </div>
    {redFlags.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mb-3 text-red-600">Areas of Concern</h3>
        <ul className="space-y-2">
          {redFlags.map((flag, index) => (
            <li key={index} className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{flag}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default StrengthsAndConcerns;
