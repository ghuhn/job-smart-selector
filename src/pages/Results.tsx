import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Download, Mail, Phone, MapPin, Star, CheckCircle, AlertTriangle, FileText, Code } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";
import ResultsHeader from "@/components/results/ResultsHeader";
import SummaryCards from "@/components/results/SummaryCards";
import AgentScoreCircles from "@/components/results/AgentScoreCircles";

const Results = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [jobDescription, setJobDescription] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    console.log('Loading results...');
    
    // Load analysis results and job description from localStorage
    const savedResults = localStorage.getItem('analysisResults');
    const savedJobDesc = localStorage.getItem('jobDescription');
    const uploadedResumes = localStorage.getItem('uploadedResumes');
    
    console.log('Saved results:', savedResults);
    console.log('Uploaded resumes:', uploadedResumes);
    
    if (savedJobDesc) {
      try {
        const jobDesc = JSON.parse(savedJobDesc);
        setJobDescription(jobDesc);
        console.log('Loaded job description:', jobDesc);
      } catch (error) {
        console.error('Error parsing job description:', error);
      }
    }
    
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        console.log('Parsed analysis results:', results);
        
        if (results && results.length > 0) {
          setCandidates(results);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved results:', error);
      }
    }
    
    // If no valid results but we have uploaded resumes, redirect back to processing
    if (uploadedResumes) {
      try {
        const resumes = JSON.parse(uploadedResumes);
        if (resumes && resumes.length > 0) {
          console.log('No analysis results found but resumes exist, redirecting to processing...');
          toast({
            title: "No analysis results found",
            description: "Redirecting back to process your resumes",
            variant: "destructive"
          });
          navigate('/processing');
          return;
        }
      } catch (error) {
        console.error('Error parsing uploaded resumes:', error);
      }
    }
    
    // If we get here, there's no data at all
    console.log('No data found, redirecting to upload...');
    toast({
      title: "No data found",
      description: "Please upload resumes first",
      variant: "destructive"
    });
    navigate('/upload');
  };

  const handleDownload = (type: 'topN' | 'detailed' | 'single', candidateIndex?: number) => {
    let filename = '';
    let content = '';
    const topN = jobDescription.topNCandidates || '3';
    
    if (type === 'topN') {
      filename = `top-${topN}-candidates-summary.txt`;
      content = `TOP ${topN} CANDIDATE RECOMMENDATIONS\nJob Title: ${jobDescription.jobTitle}\nDepartment: ${jobDescription.department}\n\n${candidates.map((analysis) => 
        `RANK ${analysis.rank}: ${analysis.candidate.name}\nOverall Score: ${analysis.scores.overall}%\nOverall Fit: ${analysis.overallFit}\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\nExperience: ${analysis.candidate.experience}\nKey Strengths: ${analysis.strengths.slice(0,3).join(', ')}\nRecommendation: ${analysis.recommendation}\n\n${'-'.repeat(80)}\n\n`
      ).join('')}`;
    } else if (type === 'detailed') {
      filename = `detailed-analysis-report-${jobDescription.jobTitle?.replace(/\s+/g, '-').toLowerCase()}.txt`;
      content = `COMPREHENSIVE CANDIDATE ANALYSIS REPORT\n\nJob Title: ${jobDescription.jobTitle}\nDepartment: ${jobDescription.department}\nExperience Level: ${jobDescription.experienceLevel}\nRequired Skills: ${jobDescription.requiredSkills}\nTop ${topN} Candidates Selected\n\n${'='.repeat(100)}\n\n${candidates.map(analysis => 
        `CANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\nExperience: ${analysis.candidate.experience} (${analysis.candidate.experienceYears} years)\nEducation: ${analysis.candidate.education}\nCertifications: ${analysis.candidate.certifications.join(', ') || 'None listed'}\nLanguages: ${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `- ${p.name}: ${p.description} (${p.technologies.join(', ')})`).join('\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORE BREAKDOWN:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nKEY STRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS OF CONCERN:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}\n\n${'='.repeat(100)}\n\n`
      ).join('')}`;
    } else if (type === 'single' && candidateIndex !== undefined) {
      const analysis = candidates[candidateIndex];
      filename = `${analysis.candidate.name.replace(/\s+/g, '-').toLowerCase()}-comprehensive-profile.txt`;
      content = `COMPREHENSIVE CANDIDATE PROFILE\n\nCANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank} of ${candidates.length}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\n${analysis.candidate.summary}\n\nEXPERIENCE:\n${analysis.candidate.experience} (${analysis.candidate.experienceYears} years)\n\nEDUCATION:\n${analysis.candidate.education}\nLevel: ${analysis.candidate.educationLevel}\n\nCERTIFICATIONS:\n${analysis.candidate.certifications.map(c => `- ${c}`).join('\n') || 'None listed'}\n\nLANGUAGES:\n${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nWORK EXPERIENCE:\n${analysis.candidate.previousRoles.map(role => `${role.title} at ${role.company} (${role.duration})\nKey Responsibilities:\n${role.responsibilities.map(r => `- ${r}`).join('\n')}`).join('\n\n')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `${p.name}:\n${p.description}\nTechnologies: ${p.technologies.join(', ')}`).join('\n\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORING:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nSTRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS FOR IMPROVEMENT:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `${filename} is being downloaded`
    });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Results...</h1>
          <p className="text-gray-600">Please wait while we prepare your analysis results.</p>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find any analysis results. Please upload resumes and process them first.</p>
          <Button onClick={() => navigate('/upload')}>
            Go to Upload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ResultsHeader 
        jobTitle={jobDescription.jobTitle}
        department={jobDescription.department}
        candidateCount={candidates.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SummaryCards candidates={candidates} />

        {/* Download Actions */}
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download Comprehensive Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => handleDownload('topN')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Top {candidates.length} Summary
              </Button>
              <Button 
                onClick={() => handleDownload('detailed')}
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Complete Analysis Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Results */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Candidate List */}
          <div className="lg:col-span-1 space-y-4">
            {candidates.map((analysis, index) => (
              <Card 
                key={index}
                className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedCandidate === index 
                    ? 'bg-blue-50 ring-2 ring-blue-500' 
                    : 'bg-white/60 backdrop-blur-sm hover:bg-white/80'
                }`}
                onClick={() => setSelectedCandidate(index)}
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
                      handleDownload('single', index);
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>{candidates[selectedCandidate].candidate.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-lg px-3 py-1 ${getFitBadgeColor(candidates[selectedCandidate].overallFit)}`}>
                      {candidates[selectedCandidate].overallFit} Fit
                    </Badge>
                    <Badge className={`text-lg px-3 py-1 ${getScoreBg(candidates[selectedCandidate].scores.overall)} ${getScoreColor(candidates[selectedCandidate].scores.overall)}`}>
                      Rank #{candidates[selectedCandidate].rank}
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
                      {candidates[selectedCandidate].candidate.email}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2" />
                      {candidates[selectedCandidate].candidate.phone}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      {candidates[selectedCandidate].candidate.location}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Experience:</strong> {candidates[selectedCandidate].candidate.experience}</p>
                    <p><strong>Education:</strong> {candidates[selectedCandidate].candidate.education}</p>
                    <p><strong>Languages:</strong> {candidates[selectedCandidate].candidate.languages.join(', ')}</p>
                  </div>
                </div>

                {/* Professional Summary */}
                {candidates[selectedCandidate].candidate.summary && candidates[selectedCandidate].candidate.summary !== "Not provided" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{candidates[selectedCandidate].candidate.summary}</p>
                  </div>
                )}

                <AgentScoreCircles candidate={candidates[selectedCandidate]} />

                {/* Skills */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidates[selectedCandidate].candidate.technicalSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidates[selectedCandidate].candidate.softSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {candidates[selectedCandidate].candidate.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {candidates[selectedCandidate].candidate.certifications.map((cert, index) => (
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
                    {Object.entries(candidates[selectedCandidate].scores).filter(([key]) => key !== 'overall').map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Projects */}
                {candidates[selectedCandidate].candidate.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Key Projects</h3>
                    <div className="space-y-3">
                      {candidates[selectedCandidate].candidate.projects.map((project, index) => (
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

                {/* Key Strengths */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
                  <ul className="space-y-2">
                    {candidates[selectedCandidate].strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Red Flags */}
                {candidates[selectedCandidate].redFlags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">Areas of Concern</h3>
                    <ul className="space-y-2">
                      {candidates[selectedCandidate].redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Analysis */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-800">Experience Match</h4>
                        <p className="text-blue-700 text-sm">{candidates[selectedCandidate].detailedAnalysis.experienceMatch}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-green-800">Education Fit</h4>
                        <p className="text-green-700 text-sm">{candidates[selectedCandidate].detailedAnalysis.educationFit}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-800">Project Relevance</h4>
                        <p className="text-purple-700 text-sm">{candidates[selectedCandidate].detailedAnalysis.projectRelevance}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-yellow-800">Growth Potential</h4>
                        <p className="text-yellow-700 text-sm">{candidates[selectedCandidate].detailedAnalysis.growthPotential}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Agent Feedback */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">AI Agent Analysis</h3>
                  <div className="space-y-4">
                    {candidates[selectedCandidate].agentFeedbacks.map((feedback, index) => (
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
                              {feedback.recommendations.map((rec, recIndex) => (
                                <li key={recIndex}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {feedback.concerns.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-red-700">Concerns:</span>
                            <ul className="text-sm text-red-600 ml-4">
                              {feedback.concerns.length > 0 ? feedback.concerns.map(c => (
                                <li key={c}>• {c}</li>
                              )) : '- None identified'}
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
                  <p className="text-blue-700">{candidates[selectedCandidate].recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
