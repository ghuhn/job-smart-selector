
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressOverviewProps {
  progress: number;
  currentAgent: string;
  currentCandidateIndex: number;
  totalCandidates: number;
}

const ProgressOverview = ({
  progress,
  currentAgent,
  currentCandidateIndex,
  totalCandidates,
}: ProgressOverviewProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm mb-8">
      <CardHeader>
        <CardTitle className="text-center">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-3" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-gray-600 mt-2">{currentAgent}</div>
            {totalCandidates > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                Processing candidate {currentCandidateIndex} of {totalCandidates}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
