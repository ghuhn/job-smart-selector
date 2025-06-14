
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Brain, Search, FileText, Target } from "lucide-react";
import { langGraphMultiAgentSystem } from "@/services/recruitmentService";
import ProcessingError from "@/components/processing/ProcessingError";
import ProcessingHeader from "@/components/processing/ProcessingHeader";
import ProgressOverview from "@/components/processing/ProgressOverview";
import AgentStatusGrid from "@/components/processing/AgentStatusGrid";
import type { Agent } from "@/components/processing/AgentStatusGrid";
import ProcessingInfo from "@/components/processing/ProcessingInfo";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const agents: Agent[] = [
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

    } catch (err) {
      console.error('Processing error:', err);
      
      let errorMessage = 'An unknown error occurred during processing. Please try again.';
      const error: any = err; 

      if (error && error.value && typeof error.value.message === 'string') {
        if (error.value.message.includes('404')) {
          errorMessage = 'The resume parsing service could not be reached (Error 404). The service might be temporarily unavailable. Please try again later.';
        } else {
          errorMessage = `An error occurred: ${error.value.message}. Please check the details and try again.`;
        }
      } else if (error instanceof Error) {
        errorMessage = `An error occurred: ${error.message}. Please check the details and try again.`;
      }
      
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const getAgentStatus = (agentId: string, candidateIndex: number) => {
    const status = agentStatuses.find(s => s.agentId === agentId && s.candidateIndex === candidateIndex);
    if (!status) return 'pending';
    return status.status as 'completed' | 'processing' | 'pending';
  };

  if (error) {
    return <ProcessingError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ProcessingHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h1>
          <p className="text-xl text-gray-600">Our multi-agent system is analyzing candidates using advanced LLM processing</p>
        </div>

        <ProgressOverview
          progress={progress}
          currentAgent={currentAgent}
          currentCandidateIndex={currentCandidateIndex}
          totalCandidates={totalCandidates}
        />

        <AgentStatusGrid
          agents={agents}
          getAgentStatus={getAgentStatus}
          totalCandidates={totalCandidates}
        />

        <ProcessingInfo />
      </div>
    </div>
  );
};

export default Processing;
