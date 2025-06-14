import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Star, AlertTriangle, FileText, Code, Users } from "lucide-react";
import type { CandidateAnalysis } from "@/types/candidates";
import AgentScoreCircles from "@/components/results/AgentScoreCircles";

interface CandidateDetailProps {
  analysis: CandidateAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 90) return 'bg-green-100';
  if (score >= 80) return 'bg-blue-100';
  if (score >= 70) return 'bg-yellow-100';
  return 'bg-red-100';
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

const CandidateDetail = ({ analysis }: CandidateDetailProps) => {
  if (!analysis) return null;

  return (
    <div className="lg:col-span-2">
      <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>{analysis.candidate.name}</span>
            <div className="flex items-center space-x-2">
              <Badge className={`text-lg px-3 py-1 ${getFitBadgeColor(analysis.overallFit)}`}>
                {analysis.overallFit} Fit
              </Badge>
              <Badge className={`text-lg px-3 py-1 ${getScoreBg(analysis.scores.overall)} ${getScoreColor(analysis.scores.overall)}`}>
                Rank #{analysis.rank}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact & Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2" />
                {analysis.candidate.email}
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2" />
                {analysis.candidate.phone}
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2" />
                {analysis.candidate.location}
              </div>
            </div>
            <div className="space-y-2">
              <p><strong>Experience:</strong> {analysis.candidate.experienceYears} years</p>
              <p><strong>Education:</strong> {analysis.candidate.educationLevel}</p>
              <p><strong>Languages:</strong> {analysis.candidate.languages.join(', ')}</p>
            </div>
          </div>

          {/* Professional Summary */}
          {analysis.candidate.summary && analysis.candidate.summary !== "Professional summary not found" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{analysis.candidate.summary}</p>
            </div>
          )}

          <AgentScoreCircles candidate={analysis} />

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.candidate.technicalSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.candidate.softSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          {analysis.candidate.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.candidate.certifications.map((cert, index) => (
                  <Badge key={index} className="px-3 py-1 bg-purple-100 text-purple-800">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Score Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Comprehensive Score Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(analysis.scores).filter(([key]) => key !== 'overall').map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
                    <span className={`text-sm font-bold ${getScoreColor(score as number)}`}>{score as number}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${score as number}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          {analysis.candidate.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Projects</h3>
              <div className="space-y-3">
                {analysis.candidate.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Strengths & Red Flags */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            {analysis.redFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Areas of Concern</h3>
                <ul className="space-y-2">
                  {analysis.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Detailed Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Experience Match</h4>
                  <p className="text-blue-700 text-sm">{analysis.detailedAnalysis.experienceMatch}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800">Education Fit</h4>
                  <p className="text-green-700 text-sm">{analysis.detailedAnalysis.educationFit}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Project Relevance</h4>
                  <p className="text-purple-700 text-sm">{analysis.detailedAnalysis.projectRelevance}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Growth Potential</h4>
                  <p className="text-yellow-700 text-sm">{analysis.detailedAnalysis.growthPotential}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Agent Feedback */}
          <div>
            <h3 className="text-lg font-semibold mb-3">AI Agent Analysis</h3>
            <div className="space-y-4">
              {analysis.agentFeedbacks.map((feedback, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      {feedback.agent === 'HR Agent' && <Users className="h-4 w-4 mr-2" />}
                      {feedback.agent === 'Technical Evaluator' && <Code className="h-4 w-4 mr-2" />}
                      {feedback.agent}
                    </h4>
                    <Badge variant="outline">Confidence: {feedback.confidence}%</Badge>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{feedback.analysis}</p>
                  {feedback.recommendations.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-700">Recommendations:</span>
                      <ul className="text-sm text-green-600 ml-4">
                        {feedback.recommendations.map((rec, recIndex) => <li key={recIndex}>• {rec}</li>)}
                      </ul>
                    </div>
                  )}
                  {feedback.concerns.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-red-700">Concerns:</span>
                      <ul className="text-sm text-red-600 ml-4">
                        {feedback.concerns.map(c => <li key={c}>• {c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Recommendation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Final AI Recommendation</h3>
            <p className="text-blue-700">{analysis.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetail;
