
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, Users, Brain, Search, FileText, Target } from "lucide-react";
import { langGraphMultiAgentSystem } from "@/utils/multiAgentSystem";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const agents = [
    { id: 'recruiter', name: 'Recruiter Agent', icon: <Users className="h-5 w-5" />, description: 'Extracting comprehensive candidate information' },
    { id: 'analyst', name: 'Analyst Agent', icon: <Search className="h-5 w-5" />, description: 'Analyzing skills and experience match' },
    { id: 'hr', name: 'HR Agent', icon: <Brain className="h-5 w-5" />, description: 'Evaluating soft skills and cultural fit' },
    { id: 'technical', name: 'Technical Evaluator', icon: <FileText className="h-5 w-5" />, description: 'Assessing technical competency' },
    { id: 'recommender', name: 'Recommender Agent', icon: <Target className="h-5 w-5" />, description: 'Generating final recommendations' }
  ];

  useEffect(() => {
    startProcessing();
  }, []);

  const startProcessing = async () => {
    try {
      // Get uploaded resumes and job description
      const uploadedResumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');
      const jobDescription = JSON.parse(localStorage.getItem('jobDescription') || '{}');
      
      if (uploadedResumes.length === 0 || !jobDescription.jobTitle) {
        setError('Missing resume data or job description');
        return;
      }

      setTotalCandidates(uploadedResumes.length);
      const topN = parseInt(jobDescription.topNCandidates) || 3;

      // Simulate progress for UI
      let currentProgress = 0;
      const totalSteps = uploadedResumes.length * agents.length;
      const progressIncrement = 100 / totalSteps;

      // Start processing
      setCurrentAgent('Initializing LangGraph Multi-Agent System...');
      setProgress(5);

      // Process all resumes
      const results = await langGraphMultiAgentSystem.processMultipleResumes(uploadedResumes, jobDescription);

      // Simulate agent progress for each candidate
      for (let candidateIndex = 0; candidateIndex < uploadedResumes.length; candidateIndex++) {
        setCurrentCandidateIndex(candidateIndex + 1);
        
        for (let agentIndex = 0; agentIndex < agents.length; agentIndex++) {
          const agent = agents[agentIndex];
          setCurrentAgent(`Processing Candidate ${candidateIndex + 1}: ${agent.name}`);
          
          // Update agent status
          setAgentStatuses(prev => {
            const updated = [...prev];
            const existingIndex = updated.findIndex(status => 
              status.candidateIndex === candidateIndex && status.agentId === agent.id
            );
            
            if (existingIndex >= 0) {
              updated[existingIndex].status = 'completed';
            } else {
              updated.push({
                candidateIndex,
                agentId: agent.id,
                agentName: agent.name,
                status: 'processing'
              });
            }
            return updated;
          });

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800));
          
          currentProgress += progressIncrement;
          setProgress(Math.min(currentProgress, 95));
        }
      }

      // Final processing
      setCurrentAgent(`Ranking top ${topN} candidates...`);
      setProgress(100);
      
      // Store results
      localStorage.setItem('analysisResults', JSON.stringify(results));
      
      // Wait a moment then navigate
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/results');
      }, 2000);

    } catch (error) {
      console.error('Processing error:', error);
      setError('An error occurred during processing. Please try again.');
      setIsProcessing(false);
    }
  };

  const getAgentStatus = (agentId: string, candidateIndex: number) => {
    const status = agentStatuses.find(s => s.agentId === agentId && s.candidateIndex === candidateIndex);
    if (!status) return 'pending';
    return status.status;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/job-description')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">LangGraph Multi-Agent Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Step 3 of 4</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h1>
          <p className="text-xl text-gray-600">Our multi-agent system is analyzing candidates using advanced LLM processing</p>
        </div>

        {/* Progress Overview */}
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

        {/* Agent Status Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent) => (
            <Card key={agent.id} className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  {agent.icon}
                  <span>{agent.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                
                {/* Show status for each candidate */}
                <div className="space-y-2">
                  {Array.from({ length: Math.min(totalCandidates, 5) }, (_, index) => {
                    const status = getAgentStatus(agent.id, index);
                    return (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">Candidate {index + 1}:</span>
                        {status === 'completed' ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Complete</span>
                          </div>
                        ) : status === 'processing' ? (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span>Processing</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {totalCandidates > 5 && (
                    <div className="text-xs text-gray-400">
                      ...and {totalCandidates - 5} more candidates
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Processing Info */}
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
      </div>
    </div>
  );
};

export default Processing;
