import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Download, User, Award, TrendingUp, FileText, Mail, Phone, MapPin, Star, CheckCircle, AlertTriangle, Brain, Code, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";

const Results = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [jobDescription, setJobDescription] = useState<any>({});

  useEffect(() => {
    // Load analysis results and job description from localStorage
    const savedResults = localStorage.getItem('analysisResults');
    const savedJobDesc = localStorage.getItem('jobDescription');
    
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        setCandidates(results);
      } catch (error) {
        console.error('Error parsing saved results:', error);
        loadMockData();
      }
    } else {
      loadMockData();
    }

    if (savedJobDesc) {
      try {
        const jobDesc = JSON.parse(savedJobDesc);
        setJobDescription(jobDesc);
      } catch (error) {
        console.error('Error parsing job description:', error);
      }
    }
  }, []);

  const loadMockData = () => {
    const mockCandidates: CandidateAnalysis[] = [
      {
        rank: 1,
        candidate: {
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com", 
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
          technicalSkills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
          softSkills: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
          experience: "6 years",
          experienceYears: 6,
          education: "MS Computer Science, Stanford University",
          educationLevel: "Masters",
          certifications: ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator"],
          languages: ["English", "Spanish"],
          previousRoles: [
            {
              title: "Senior Software Engineer",
              company: "TechCorp",
              duration: "2021-2024",
              responsibilities: ["Led team of 5 developers", "Architected microservices platform", "Improved system performance by 40%"]
            }
          ],
          projects: [
            {
              name: "E-commerce Platform Redesign",
              description: "Full-stack development of modern e-commerce platform",
              technologies: ["React", "Node.js", "PostgreSQL", "AWS"]
            }
          ],
          achievements: ["Employee of the Year 2023", "Led successful product launch", "Mentored 10+ junior developers"],
          summary: "Experienced full-stack developer with strong leadership skills and proven track record in scalable web applications",
          keywords: ["React", "Node.js", "Leadership", "Microservices", "AWS"]
        },
        scores: {
          technical: 96,
          experience: 92,
          education: 95,
          communication: 93,
          cultural_fit: 94,
          project_relevance: 97,
          skill_match: 95,
          overall: 94
        },
        strengths: [
          "Exceptional technical leadership experience",
          "Strong full-stack development skills with modern frameworks",
          "Proven track record in scalable system architecture",
          "Excellent mentoring and team collaboration abilities"
        ],
        redFlags: [],
        recommendation: "Highly recommended - Perfect match for the role with exceptional technical skills, leadership experience, and cultural fit. Ready for immediate impact.",
        agentFeedbacks: [
          {
            agent: "HR Agent",
            analysis: "Outstanding candidate with excellent leadership qualities and strong career progression.",
            recommendations: ["Fast-track for interview", "Consider for senior role"],
            concerns: [],
            confidence: 95
          },
          {
            agent: "Technical Evaluator",
            analysis: "Exceptional technical depth with relevant project experience and modern technology stack.",
            recommendations: ["Technical deep-dive interview", "Architecture discussion"],
            concerns: [],
            confidence: 96
          }
        ],
        detailedAnalysis: {
          skillGaps: [],
          experienceMatch: "Perfect alignment with role requirements and seniority level",
          educationFit: "Advanced degree from top university exceeds requirements",
          projectRelevance: "Projects directly relevant to role with demonstrated impact",
          growthPotential: "High potential for leadership roles and technical advancement"
        },
        overallFit: "Excellent"
      }
      // Add more mock candidates as needed...
    ];
    setCandidates(mockCandidates);
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
        `CANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\nLinkedIn: ${analysis.candidate.linkedIn || 'Not provided'}\nGitHub: ${analysis.candidate.github || 'Not provided'}\n\nPROFESSIONAL SUMMARY:\nExperience: ${analysis.candidate.experience} (${analysis.candidate.experienceYears} years)\nEducation: ${analysis.candidate.education}\nCertifications: ${analysis.candidate.certifications.join(', ') || 'None listed'}\nLanguages: ${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `- ${p.name}: ${p.description} (${p.technologies.join(', ')})`).join('\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORE BREAKDOWN:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nKEY STRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS OF CONCERN:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nDETAILED ANALYSIS:\nSkill Gaps: ${analysis.detailedAnalysis.skillGaps.join(', ') || 'None identified'}\nExperience Match: ${analysis.detailedAnalysis.experienceMatch}\nEducation Fit: ${analysis.detailedAnalysis.educationFit}\nProject Relevance: ${analysis.detailedAnalysis.projectRelevance}\nGrowth Potential: ${analysis.detailedAnalysis.growthPotential}\n\nAI AGENT FEEDBACK:\n${analysis.agentFeedbacks.map(feedback => `${feedback.agent} (Confidence: ${feedback.confidence}%):\n${feedback.analysis}\nRecommendations: ${feedback.recommendations.join(', ')}\nConcerns: ${feedback.concerns.join(', ') || 'None'}`).join('\n\n')}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}\n\n${'='.repeat(100)}\n\n`
      ).join('')}`;
    } else if (type === 'single' && candidateIndex !== undefined) {
      const analysis = candidates[candidateIndex];
      filename = `${analysis.candidate.name.replace(/\s+/g, '-').toLowerCase()}-comprehensive-profile.txt`;
      content = `COMPREHENSIVE CANDIDATE PROFILE\n\nCANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank} of ${candidates.length}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\nLinkedIn: ${analysis.candidate.linkedIn || 'Not provided'}\nGitHub: ${analysis.candidate.github || 'Not provided'}\n\nPROFESSIONAL SUMMARY:\n${analysis.candidate.summary}\n\nEXPERIENCE:\n${analysis.candidate.experience} (${analysis.candidate.experienceYears} years)\n\nEDUCATION:\n${analysis.candidate.education}\nLevel: ${analysis.candidate.educationLevel}\n\nCERTIFICATIONS:\n${analysis.candidate.certifications.map(c => `- ${c}`).join('\n') || 'None listed'}\n\nLANGUAGES:\n${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nWORK EXPERIENCE:\n${analysis.candidate.previousRoles.map(role => `${role.title} at ${role.company} (${role.duration})\nKey Responsibilities:\n${role.responsibilities.map(r => `- ${r}`).join('\n')}`).join('\n\n')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `${p.name}:\n${p.description}\nTechnologies: ${p.technologies.join(', ')}`).join('\n\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORING:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nSTRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS FOR IMPROVEMENT:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nDETAILED ANALYSIS:\nSkill Gaps: ${analysis.detailedAnalysis.skillGaps.join(', ') || 'None identified'}\nExperience Match: ${analysis.detailedAnalysis.experienceMatch}\nEducation Fit: ${analysis.detailedAnalysis.educationFit}\nProject Relevance: ${analysis.detailedAnalysis.projectRelevance}\nGrowth Potential: ${analysis.detailedAnalysis.growthPotential}\n\nAI AGENT ANALYSIS:\n${analysis.agentFeedbacks.map(feedback => `\n${feedback.agent.toUpperCase()} ASSESSMENT (Confidence: ${feedback.confidence}%):\n${feedback.analysis}\n\nRecommendations:\n${feedback.recommendations.map(r => `- ${r}`).join('\n')}\n\nConcerns:\n${feedback.concerns.length > 0 ? feedback.concerns.map(c => `- ${c}`).join('\n') : '- None identified'}`).join('\n')}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}`;
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

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Results...</h1>
          <p className="text-gray-600">Please wait while we prepare your analysis results.</p>
        </div>
      </div>
    );
  }

  const topN = jobDescription.topNCandidates || '3';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <p className="text-xl text-gray-600">Top {topN} candidates for {jobDescription.jobTitle} ranked by our multi-agent system</p>
          {jobDescription.department && (
            <p className="text-lg text-gray-500">Department: {jobDescription.department}</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{candidates.length}</div>
              <p className="text-gray-600">Top Candidates</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">{candidates[0]?.scores.overall || 0}%</div>
              <p className="text-gray-600">Best Match Score</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {JSON.parse(localStorage.getItem('uploadedResumes') || '[]').length}
              </div>
              <p className="text-gray-600">Resumes Analyzed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
              <p className="text-gray-600">AI Agents Used</p>
            </CardContent>
          </Card>
        </div>

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
                Top {topN} Summary
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
                {candidates[selectedCandidate].candidate.summary && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{candidates[selectedCandidate].candidate.summary}</p>
                  </div>
                )}

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
                              {feedback.concerns.map((concern, conIndex) => (
                                <li key={conIndex}>• {concern}</li>
                              ))}
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
