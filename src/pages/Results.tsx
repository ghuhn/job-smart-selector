
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Download, User, Award, TrendingUp, FileText, Mail, Phone, MapPin, Star, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";

const Results = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);

  useEffect(() => {
    // Load analysis results from localStorage
    const savedResults = localStorage.getItem('analysisResults');
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        setCandidates(results);
      } catch (error) {
        console.error('Error parsing saved results:', error);
        // Use mock data as fallback
        loadMockData();
      }
    } else {
      // Use mock data as fallback
      loadMockData();
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
          experience: "6 years",
          education: "MS Computer Science, Stanford University",
          previousRoles: [
            "Senior Software Engineer at TechCorp (2021-2024)",
            "Full Stack Developer at StartupXYZ (2019-2021)",
            "Software Developer at Innovation Labs (2018-2019)"
          ]
        },
        scores: {
          technical: 96,
          experience: 92,
          education: 95,
          communication: 93,
          cultural_fit: 94,
          overall: 94
        },
        strengths: [
          "Strong full-stack development experience with modern frameworks",
          "Led multiple successful product launches",
          "Excellent communication and team leadership skills",
          "Proven track record in agile development environments"
        ],
        redFlags: [],
        recommendation: "Highly recommended - Perfect match for the role with exceptional technical skills and leadership experience."
      },
      {
        rank: 2,
        candidate: {
          name: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+1 (555) 234-5678", 
          location: "Seattle, WA",
          skills: ["JavaScript", "React", "Python", "MongoDB", "GraphQL", "Kubernetes"],
          experience: "5 years",
          education: "BS Computer Engineering, University of Washington",
          previousRoles: [
            "Software Engineer at CloudTech (2020-2024)",
            "Junior Developer at WebSolutions (2019-2020)"
          ]
        },
        scores: {
          technical: 91,
          experience: 87,
          education: 88,
          communication: 90,
          cultural_fit: 89,
          overall: 89
        },
        strengths: [
          "Strong problem-solving abilities with complex systems",
          "Experience with microservices architecture", 
          "Active contributor to open-source projects",
          "Quick learner with adaptability to new technologies"
        ],
        redFlags: ["Gap in employment (3 months in 2019)"],
        recommendation: "Strong candidate with solid technical foundation and growth potential. Minor employment gap needs clarification."
      },
      {
        rank: 3,
        candidate: {
          name: "Emily Rodriguez",
          email: "emily.rodriguez@email.com",
          phone: "+1 (555) 345-6789",
          location: "Austin, TX", 
          skills: ["Vue.js", "Node.js", "MySQL", "Redis", "Git", "Agile"],
          experience: "4 years",
          education: "BS Software Engineering, UT Austin",
          previousRoles: [
            "Frontend Developer at DesignCorp (2021-2024)",
            "Web Developer at LocalBusiness (2020-2021)"
          ]
        },
        scores: {
          technical: 87,
          experience: 82,
          education: 85,
          communication: 88,
          cultural_fit: 86,
          overall: 85
        },
        strengths: [
          "Strong frontend development skills",
          "Experience with performance optimization",
          "Good understanding of UX principles",
          "Collaborative team player"
        ],
        redFlags: ["Limited backend experience", "No cloud platform experience"],
        recommendation: "Good candidate with strong frontend skills. Would benefit from additional backend training and cloud experience."
      }
    ];
    setCandidates(mockCandidates);
  };

  const handleDownload = (type: 'top3' | 'detailed' | 'single', candidateIndex?: number) => {
    let filename = '';
    let content = '';
    
    if (type === 'top3') {
      filename = 'top-3-candidates-summary.txt';
      content = `TOP 3 CANDIDATE RECOMMENDATIONS\n\n${candidates.map((analysis) => 
        `RANK ${analysis.rank}: ${analysis.candidate.name}\nScore: ${analysis.scores.overall}%\nEmail: ${analysis.candidate.email}\nRecommendation: ${analysis.recommendation}\n\n`
      ).join('')}`;
    } else if (type === 'detailed') {
      filename = 'detailed-analysis-report.txt';
      content = `DETAILED CANDIDATE ANALYSIS REPORT\n\n${candidates.map(analysis => 
        `CANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank}\nOVERALL SCORE: ${analysis.scores.overall}%\n\nCONTACT INFO:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\nExperience: ${analysis.candidate.experience}\nEducation: ${analysis.candidate.education}\n\nSKILLS:\n${analysis.candidate.skills.join(', ')}\n\nKEY STRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nSCORE BREAKDOWN:\nTechnical: ${analysis.scores.technical}%\nExperience: ${analysis.scores.experience}%\nEducation: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\n\nRECOMMENDATION: ${analysis.recommendation}\n\n${'='.repeat(80)}\n\n`
      ).join('')}`;
    } else if (type === 'single' && candidateIndex !== undefined) {
      const analysis = candidates[candidateIndex];
      filename = `${analysis.candidate.name.replace(' ', '-').toLowerCase()}-profile.txt`;
      content = `CANDIDATE PROFILE: ${analysis.candidate.name}\n\nRANK: ${analysis.rank}\nOVERALL SCORE: ${analysis.scores.overall}%\n\nCONTACT INFO:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\nExperience: ${analysis.candidate.experience}\nEducation: ${analysis.candidate.education}\n\nSKILLS:\n${analysis.candidate.skills.join(', ')}\n\nKEY STRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nSCORE BREAKDOWN:\nTechnical: ${analysis.scores.technical}%\nExperience: ${analysis.scores.experience}%\nEducation: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\n\nRECOMMENDATION: ${analysis.recommendation}`;
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
              <span className="text-sm text-gray-600">Analysis Complete</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analysis Results</h1>
          <p className="text-xl text-gray-600">Top 3 candidates ranked by our AI multi-agent system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Download Actions */}
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => handleDownload('top3')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Top 3 Summary
              </Button>
              <Button 
                onClick={() => handleDownload('detailed')}
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Detailed Analysis
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
                  <Badge className={`text-lg px-3 py-1 ${getScoreBg(candidates[selectedCandidate].scores.overall)} ${getScoreColor(candidates[selectedCandidate].scores.overall)}`}>
                    Rank #{candidates[selectedCandidate].rank}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Info */}
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
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidates[selectedCandidate].candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Score Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Score Breakdown</h3>
                  <div className="space-y-3">
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

                {/* Recommendation */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">AI Recommendation</h3>
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
