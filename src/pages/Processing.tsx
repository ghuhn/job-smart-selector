
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Loader2, Brain, Search, Users, Award } from "lucide-react";
import { multiAgentSystem, JobRequirements } from "@/utils/multiAgentSystem";
import { toast } from "@/hooks/use-toast";

const Processing = () => {
  const navigate = useNavigate();
  const [currentAgent, setCurrentAgent] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const agents = [
    {
      name: "Recruiter Agent",
      description: "Extracting education, skills, tools, and experience from resumes",
      icon: <Search className="h-6 w-6" />,
      duration: 3000
    },
    {
      name: "Analyst Agent", 
      description: "Matching extracted features to job description using scoring algorithm",
      icon: <Brain className="h-6 w-6" />,
      duration: 4000
    },
    {
      name: "HR Agent",
      description: "Evaluating tone, soft skills, and identifying potential red flags",
      icon: <Users className="h-6 w-6" />,
      duration: 3500
    },
    {
      name: "Recommender Agent",
      description: "Ranking resumes and selecting top 3 candidates for the role",
      icon: <Award className="h-6 w-6" />,
      duration: 2500
    }
  ];

  const processResumes = async () => {
    try {
      // Get uploaded resume data and job description
      const uploadedResumes = JSON.parse(localStorage.getItem('uploadedResumes') || '[]');
      const jobDescriptionData = JSON.parse(localStorage.getItem('jobDescription') || '{}');
      
      if (uploadedResumes.length === 0 || !jobDescriptionData.jobTitle) {
        toast({
          title: "Missing data",
          description: "Please upload resumes and provide job description",
          variant: "destructive"
        });
        navigate('/upload');
        return;
      }

      // Convert job description to required format
      const jobReq: JobRequirements = {
        jobTitle: jobDescriptionData.jobTitle,
        requiredSkills: jobDescriptionData.requiredSkills,
        experienceLevel: jobDescriptionData.experienceLevel,
        jobDescription: jobDescriptionData.jobDescription,
        minimumExperience: jobDescriptionData.minimumExperience,
        education: jobDescriptionData.education
      };

      // Mock resume texts (in real implementation, you'd extract text from uploaded PDFs)
      const mockResumeTexts = [
        `Sarah Johnson
Email: sarah.johnson@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Senior Full Stack Developer with 6 years of experience building scalable web applications using React, Node.js, and cloud technologies. Led multiple successful product launches and mentored junior developers.

EDUCATION
MS Computer Science, Stanford University (2018)
BS Software Engineering, UC Berkeley (2016)

TECHNICAL SKILLS
- Frontend: React, TypeScript, Vue.js, HTML5, CSS3
- Backend: Node.js, Python, Express.js, RESTful APIs
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Docker, Kubernetes
- Tools: Git, Webpack, Jest, Agile/Scrum

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechCorp | 2021-2024
- Led development of e-commerce platform serving 1M+ users
- Implemented microservices architecture reducing response time by 40%
- Mentored team of 5 junior developers
- Technologies: React, Node.js, AWS, PostgreSQL

Full Stack Developer | StartupXYZ | 2019-2021
- Built customer analytics dashboard from ground up
- Integrated payment processing and user authentication
- Collaborated with design team to improve UX

Software Developer | Innovation Labs | 2018-2019
- Developed internal tools and automation scripts
- Participated in code reviews and testing processes`,

        `Michael Chen
Email: michael.chen@email.com
Phone: +1 (555) 234-5678
Location: Seattle, WA

SUMMARY
Full Stack Engineer with 5 years of experience in JavaScript technologies, Python, and cloud platforms. Strong problem-solving skills and experience with microservices architecture.

EDUCATION
BS Computer Engineering, University of Washington (2019)

TECHNICAL SKILLS
- Languages: JavaScript, Python, Java, TypeScript
- Frontend: React, Angular, HTML, CSS
- Backend: Node.js, Django, GraphQL
- Databases: MongoDB, MySQL, PostgreSQL
- Cloud: Azure, Docker, Kubernetes
- Tools: Git, Jenkins, GraphQL

EXPERIENCE
Software Engineer | CloudTech | 2020-2024
- Developed and maintained microservices for cloud platform
- Contributed to open-source projects
- Implemented CI/CD pipelines
- Gap in employment: 3 months in 2019 (personal project)

Junior Developer | WebSolutions | 2019-2020
- Built responsive web applications
- Worked with REST APIs and databases`,

        `Emily Rodriguez
Email: emily.rodriguez@email.com
Phone: +1 (555) 345-6789
Location: Austin, TX

PROFILE
Software Developer with 4 years of experience specializing in frontend development and user experience optimization. Strong skills in Vue.js and performance optimization.

EDUCATION
BS Software Engineering, University of Texas at Austin (2020)

SKILLS
- Frontend: Vue.js, JavaScript, HTML5, CSS3
- Backend: Node.js, Express.js
- Databases: MySQL, Redis
- Tools: Git, Webpack, npm
- Methodologies: Agile, Scrum

WORK HISTORY
Frontend Developer | DesignCorp | 2021-2024
- Specialized in Vue.js applications and UX optimization
- Improved website performance by 35%
- Collaborated with UX/UI designers
- Limited backend experience

Web Developer | LocalBusiness | 2020-2021
- Built company website and e-commerce features
- No cloud platform experience mentioned`
      ];

      setProcessingStatus('Starting multi-agent analysis...');

      // Simulate agent processing with real API calls
      for (let i = 0; i < agents.length; i++) {
        setCurrentAgent(i);
        setProcessingStatus(`${agents[i].name} is analyzing resumes...`);
        
        if (i === agents.length - 1) {
          // On the last agent, actually process the resumes
          setProcessingStatus('Generating final rankings and recommendations...');
          const results = await multiAgentSystem.processMultipleResumes(mockResumeTexts, jobReq);
          localStorage.setItem('analysisResults', JSON.stringify(results));
        }
        
        await new Promise(resolve => setTimeout(resolve, agents[i].duration));
        setCompletedAgents(prev => [...prev, i]);
      }
      
      setProcessingStatus('Analysis complete! Preparing results...');
      
      // Navigate to results after all agents complete
      setTimeout(() => {
        navigate('/results');
      }, 1000);
      
    } catch (error) {
      console.error('Error processing resumes:', error);
      toast({
        title: "Processing error",
        description: "An error occurred during analysis. Using mock data for demo.",
        variant: "destructive"
      });
      
      // Continue with navigation even if there's an error
      setTimeout(() => {
        navigate('/results');
      }, 2000);
    }
  };

  useEffect(() => {
    processResumes();
  }, []);

  const getAgentStatus = (index: number) => {
    if (completedAgents.includes(index)) return 'completed';
    if (index === currentAgent) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-medium">AI Processing in Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Step 3 of 4</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Agents at Work</h1>
          <p className="text-xl text-gray-600">Our multi-agent system is analyzing your resumes</p>
          {processingStatus && (
            <p className="text-blue-600 mt-2 font-medium">{processingStatus}</p>
          )}
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Progress</h2>
              <div className="text-lg font-medium text-blue-600">
                {completedAgents.length} of {agents.length} completed
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(completedAgents.length / agents.length) * 100}%` }}
              ></div>
            </div>

            {/* Agent Cards */}
            <div className="space-y-4">
              {agents.map((agent, index) => {
                const status = getAgentStatus(index);
                return (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 transition-all duration-500 ${
                      status === 'completed' 
                        ? 'border-green-200 bg-green-50' 
                        : status === 'active'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-full mr-4 ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : status === 'active'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : status === 'active' ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        status === 'completed' ? 'text-green-800' : 
                        status === 'active' ? 'text-blue-800' : 'text-gray-600'
                      }`}>
                        {agent.name}
                      </h3>
                      <p className={`text-sm ${
                        status === 'completed' ? 'text-green-600' : 
                        status === 'active' ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {agent.description}
                      </p>
                    </div>

                    <div className="ml-4">
                      {agent.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Processing Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {JSON.parse(localStorage.getItem('uploadedResumes') || '[]').length}
              </div>
              <p className="text-gray-600">Resumes Analyzing</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <p className="text-gray-600">AI Agents Working</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <p className="text-gray-600">Top Candidates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Processing;
