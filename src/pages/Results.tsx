import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, AlertTriangle, FileText, Home, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { CandidateAnalysis, ExperienceEntry, EducationEntry } from "@/types/candidates";
import ResultsHeader from "@/components/results/ResultsHeader";
import SummaryCards from "@/components/results/SummaryCards";
import CandidateList from "@/components/results/CandidateList";
import CandidateDetail from "@/components/results/CandidateDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Results = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(0);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [jobDescription, setJobDescription] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<'txt' | 'csv' | 'json'>('txt');

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

  const handleDownload = (type: 'topN' | 'detailed' | 'single', candidateIndex?: number, format: 'txt' | 'csv' | 'json' = 'txt') => {
    let filename = '';
    let content = '';
    let contentType = 'text/plain';
    const topN = jobDescription.topNCandidates || '3';
    
    const formatExperience = (exp: ExperienceEntry[]) => exp.map((e) => `${e.role} at ${e.company} (${e.duration})\n${e.description}`).join('\n\n') || 'Not provided';
    const formatEducation = (edu: EducationEntry[]) => edu.map((e) => `${e.degree} from ${e.institution} (${e.years})`).join('\n') || 'Not provided';

    if (type === 'topN') {
      const baseFilename = `top-${topN}-candidates-summary`;
      const textContent = `TOP ${topN} CANDIDATE RECOMMENDATIONS\nJob Title: ${jobDescription.jobTitle}\nDepartment: ${jobDescription.department}\n\n${candidates.map((analysis) => 
        `RANK ${analysis.rank}: ${analysis.candidate.name}\nOverall Score: ${analysis.scores.overall}%\nOverall Fit: ${analysis.overallFit}\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\nExperience: ${analysis.candidate.experience.length > 0 ? analysis.candidate.experience[0].role : 'N/A'}\nKey Strengths: ${analysis.strengths.slice(0,3).join(', ')}\nRecommendation: ${analysis.recommendation}\n\n${'-'.repeat(80)}\n\n`
      ).join('')}`;
      
      if (format === 'json') {
        filename = `${baseFilename}.json`;
        content = JSON.stringify({
          jobTitle: jobDescription.jobTitle,
          department: jobDescription.department,
          topCandidates: candidates.map(analysis => ({
            rank: analysis.rank,
            name: analysis.candidate.name,
            overallScore: analysis.scores.overall,
            overallFit: analysis.overallFit,
            email: analysis.candidate.email,
            phone: analysis.candidate.phone,
            location: analysis.candidate.location,
            experience: analysis.candidate.experience.length > 0 ? analysis.candidate.experience[0].role : 'N/A',
            keyStrengths: analysis.strengths.slice(0, 3),
            recommendation: analysis.recommendation
          }))
        }, null, 2);
        contentType = 'application/json';
      } else if (format === 'csv') {
        filename = `${baseFilename}.csv`;
        content = `Rank,Name,Overall Score,Overall Fit,Email,Phone,Location,Experience,Key Strengths,Recommendation\n${candidates.map(analysis => 
          `${analysis.rank},"${analysis.candidate.name}",${analysis.scores.overall}%,"${analysis.overallFit}","${analysis.candidate.email}","${analysis.candidate.phone}","${analysis.candidate.location}","${analysis.candidate.experience.length > 0 ? analysis.candidate.experience[0].role : 'N/A'}","${analysis.strengths.slice(0,3).join('; ')}","${analysis.recommendation.replace(/"/g, '""')}"`
        ).join('\n')}`;
        contentType = 'text/csv';
      } else {
        filename = `${baseFilename}.txt`;
        content = textContent;
      }
    } else if (type === 'detailed') {
      const baseFilename = `detailed-analysis-report-${jobDescription.jobTitle?.replace(/\s+/g, '-').toLowerCase()}`;
      const textContent = `COMPREHENSIVE CANDIDATE ANALYSIS REPORT\n\nJob Title: ${jobDescription.jobTitle}\nDepartment: ${jobDescription.department}\nExperience Level: ${jobDescription.experienceLevel}\nRequired Skills: ${jobDescription.requiredSkills}\nTop ${topN} Candidates Selected\n\n${'='.repeat(100)}\n\n${candidates.map(analysis => 
        `CANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\nExperience: ${analysis.candidate.experienceYears} years\nEducation: ${formatEducation(analysis.candidate.education)}\nCertifications: ${analysis.candidate.certifications.join(', ') || 'None listed'}\nLanguages: ${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `- ${p.name}: ${p.description} (${p.technologies.join(', ')})`).join('\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORE BREAKDOWN:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nKEY STRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS OF CONCERN:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}\n\n${'='.repeat(100)}\n\n`
      ).join('')}`;
      
      if (format === 'json') {
        filename = `${baseFilename}.json`;
        content = JSON.stringify({
          jobTitle: jobDescription.jobTitle,
          department: jobDescription.department,
          experienceLevel: jobDescription.experienceLevel,
          requiredSkills: jobDescription.requiredSkills,
          candidates: candidates.map(analysis => ({
            name: analysis.candidate.name,
            rank: analysis.rank,
            overallScore: analysis.scores.overall,
            overallFit: analysis.overallFit,
            contactInfo: {
              email: analysis.candidate.email,
              phone: analysis.candidate.phone,
              location: analysis.candidate.location
            },
            professionalSummary: {
              experienceYears: analysis.candidate.experienceYears,
              education: analysis.candidate.education,
              certifications: analysis.candidate.certifications,
              languages: analysis.candidate.languages
            },
            skills: {
              technical: analysis.candidate.technicalSkills,
              soft: analysis.candidate.softSkills
            },
            projects: analysis.candidate.projects,
            achievements: analysis.candidate.achievements,
            scores: analysis.scores,
            strengths: analysis.strengths,
            redFlags: analysis.redFlags,
            recommendation: analysis.recommendation
          }))
        }, null, 2);
        contentType = 'application/json';
      } else if (format === 'csv') {
        filename = `${baseFilename}.csv`;
        content = `Name,Rank,Overall Score,Overall Fit,Email,Phone,Location,Experience Years,Technical Skills,Soft Skills,Strengths,Red Flags,Recommendation\n${candidates.map(analysis => 
          `"${analysis.candidate.name}",${analysis.rank},${analysis.scores.overall}%,"${analysis.overallFit}","${analysis.candidate.email}","${analysis.candidate.phone}","${analysis.candidate.location}",${analysis.candidate.experienceYears},"${analysis.candidate.technicalSkills.join('; ')}","${analysis.candidate.softSkills.join('; ')}","${analysis.strengths.join('; ')}","${analysis.redFlags.join('; ')}","${analysis.recommendation.replace(/"/g, '""')}"`
        ).join('\n')}`;
        contentType = 'text/csv';
      } else {
        filename = `${baseFilename}.txt`;
        content = textContent;
      }
    } else if (type === 'single' && candidateIndex !== undefined) {
      const analysis = candidates[candidateIndex];
      const baseFilename = `${analysis.candidate.name.replace(/\s+/g, '-').toLowerCase()}-comprehensive-profile`;
      const textContent = `COMPREHENSIVE CANDIDATE PROFILE\n\nCANDIDATE: ${analysis.candidate.name}\nRANK: ${analysis.rank} of ${candidates.length}\nOVERALL SCORE: ${analysis.scores.overall}% (${analysis.overallFit} Fit)\n\nCONTACT INFORMATION:\nEmail: ${analysis.candidate.email}\nPhone: ${analysis.candidate.phone}\nLocation: ${analysis.candidate.location}\n\nPROFESSIONAL SUMMARY:\n${analysis.candidate.summary}\n\nEXPERIENCE (${analysis.candidate.experienceYears} years):\n${formatExperience(analysis.candidate.experience)}\n\nEDUCATION:\n${formatEducation(analysis.candidate.education)}\n\nCERTIFICATIONS:\n${analysis.candidate.certifications.map(c => `- ${c}`).join('\n') || 'None listed'}\n\nLANGUAGES:\n${analysis.candidate.languages.join(', ')}\n\nTECHNICAL SKILLS:\n${analysis.candidate.technicalSkills.join(', ')}\n\nSOFT SKILLS:\n${analysis.candidate.softSkills.join(', ')}\n\nKEY PROJECTS:\n${analysis.candidate.projects.map(p => `${p.name}:\n${p.description}\nTechnologies: ${p.technologies.join(', ')}`).join('\n\n')}\n\nACHIEVEMENTS:\n${analysis.candidate.achievements.map(a => `- ${a}`).join('\n')}\n\nDETAILED SCORING:\nTechnical Skills: ${analysis.scores.technical}%\nExperience Match: ${analysis.scores.experience}%\nEducation Fit: ${analysis.scores.education}%\nCommunication: ${analysis.scores.communication}%\nCultural Fit: ${analysis.scores.cultural_fit}%\nProject Relevance: ${analysis.scores.project_relevance}%\nSkill Match: ${analysis.scores.skill_match}%\n\nSTRENGTHS:\n${analysis.strengths.map(s => `- ${s}`).join('\n')}\n\nAREAS FOR IMPROVEMENT:\n${analysis.redFlags.length > 0 ? analysis.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}\n\nFINAL RECOMMENDATION:\n${analysis.recommendation}`;
      
      if (format === 'json') {
        filename = `${baseFilename}.json`;
        content = JSON.stringify(analysis, null, 2);
        contentType = 'application/json';
      } else if (format === 'csv') {
        filename = `${baseFilename}.csv`;
        content = `Field,Value\nName,"${analysis.candidate.name}"\nRank,${analysis.rank}\nOverall Score,${analysis.scores.overall}%\nOverall Fit,"${analysis.overallFit}"\nEmail,"${analysis.candidate.email}"\nPhone,"${analysis.candidate.phone}"\nLocation,"${analysis.candidate.location}"\nExperience Years,${analysis.candidate.experienceYears}\nTechnical Skills,"${analysis.candidate.technicalSkills.join('; ')}"\nSoft Skills,"${analysis.candidate.softSkills.join('; ')}"\nStrengths,"${analysis.strengths.join('; ')}"\nRed Flags,"${analysis.redFlags.join('; ')}"\nRecommendation,"${analysis.recommendation.replace(/"/g, '""')}"`;
        contentType = 'text/csv';
      } else {
        filename = `${baseFilename}.txt`;
        content = textContent;
      }
    }

    const blob = new Blob([content], { type: contentType });
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
        {/* Clickable Title */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-0 h-auto text-left hover:bg-transparent"
          >
            <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              <Home className="h-6 w-6" />
              <span>ResumeAI - Analysis Results</span>
            </div>
          </Button>
        </div>

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
            <div className="flex flex-wrap gap-4 items-center">
              <Button 
                onClick={() => handleDownload('topN')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Top {candidates.length} Summary
              </Button>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleDownload('detailed', undefined, selectedFormat)}
                  variant="outline"
                  className="flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Complete Analysis Report ({selectedFormat.toUpperCase()})
                </Button>
                
                <Select value={selectedFormat} onValueChange={(value: 'txt' | 'csv' | 'json') => setSelectedFormat(value)}>
                  <SelectTrigger className="w-20 h-10">
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
