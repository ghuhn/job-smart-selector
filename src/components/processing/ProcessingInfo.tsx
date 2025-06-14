
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProcessingInfo = () => {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>LangGraph Processing Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <strong>Comprehensive Data Extraction:</strong> Each resume is processed to extract all available information including skills, experience, education, projects, certifications, and achievements.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <strong>Multi-Agent Analysis:</strong> Specialized AI agents evaluate different aspects - technical skills, experience fit, soft skills, and cultural alignment.
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <strong>Intelligent Ranking:</strong> All agent outputs are synthesized to rank candidates and provide detailed recommendations for hiring decisions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingInfo;
