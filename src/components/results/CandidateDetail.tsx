
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CandidateAnalysis } from "@/types/candidates";
import AgentScoreCircles from "@/components/results/AgentScoreCircles";
import CandidateDetailHeader from "./details/CandidateDetailHeader";
import CandidateContactInfo from "./details/CandidateContactInfo";
import ProfessionalSummary from "./details/ProfessionalSummary";
import SkillsDisplay from "./details/SkillsDisplay";
import CertificationsList from "./details/CertificationsList";
import ScoreAnalysis from "./details/ScoreAnalysis";
import ProjectsList from "./details/ProjectsList";
import StrengthsAndConcerns from "./details/StrengthsAndConcerns";
import DetailedAnalysisDisplay from "./details/DetailedAnalysisDisplay";
import AgentFeedbackList from "./details/AgentFeedbackList";
import FinalRecommendation from "./details/FinalRecommendation";

interface CandidateDetailProps {
  analysis: CandidateAnalysis;
}

const CandidateDetail = ({ analysis }: CandidateDetailProps) => {
  if (!analysis) return null;

  return (
    <div className="lg:col-span-2">
      <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>
            <CandidateDetailHeader analysis={analysis} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CandidateContactInfo candidate={analysis.candidate} />

          <ProfessionalSummary summary={analysis.candidate.summary} />

          <AgentScoreCircles candidate={analysis} />

          <SkillsDisplay
            technicalSkills={analysis.candidate.technicalSkills}
            softSkills={analysis.candidate.softSkills}
          />

          <CertificationsList certifications={analysis.candidate.certifications} />

          <ScoreAnalysis scores={analysis.scores} />

          <ProjectsList projects={analysis.candidate.projects} />

          <StrengthsAndConcerns strengths={analysis.strengths} redFlags={analysis.redFlags} />

          <DetailedAnalysisDisplay detailedAnalysis={analysis.detailedAnalysis} />

          <AgentFeedbackList agentFeedbacks={analysis.agentFeedbacks} />

          <FinalRecommendation recommendation={analysis.recommendation} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetail;
