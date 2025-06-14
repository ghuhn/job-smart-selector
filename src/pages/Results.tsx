
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, AlertTriangle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CandidateAnalysis } from "@/utils/multiAgentSystem";
import ResultsHeader from "@/components/results/ResultsHeader";
import SummaryCards from "@/components/results/SummaryCards";
import CandidateList from "@/components/results/CandidateList";
import CandidateDetail from "@/components/results/CandidateDetail";

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
          <CandidateList
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={setSelectedCandidate}
            onDownloadProfile={(index) => handleDownload('single', index)}
          />
          
          <CandidateDetail analysis={candidates[selectedCandidate]} />
        </div>
      </div>
    </div>
  );
};

export default Results;
