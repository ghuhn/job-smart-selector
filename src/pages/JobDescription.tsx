
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, GraduationCap, Code, Target, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JobDescription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    customJobTitle: '',
    department: '',
    customDepartment: '',
    experienceLevel: '',
    minimumExperience: '',
    maximumExperience: '',
    requiredSkills: '',
    preferredSkills: '',
    education: '',
    customEducation: '',
    jobDescription: '',
    responsibilities: '',
    projectTypes: '',
    customProjectTypes: '',
    topNCandidates: '3'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['jobTitle', 'experienceLevel', 'requiredSkills', 'jobDescription', 'topNCandidates'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Process custom fields
    const processedData = {
      ...formData,
      jobTitle: formData.jobTitle === 'other' ? formData.customJobTitle : formData.jobTitle,
      department: formData.department === 'other' ? formData.customDepartment : formData.department,
      education: formData.education === 'other' ? formData.customEducation : formData.education,
      projectTypes: formData.projectTypes === 'other' ? formData.customProjectTypes : formData.projectTypes
    };

    // Store job description data
    localStorage.setItem('jobDescription', JSON.stringify(processedData));
    navigate('/processing');
  };

  // Common options for dropdowns
  const jobTitles = [
    'Software Engineer', 'Senior Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager',
    'UI/UX Designer', 'Marketing Manager', 'Sales Representative', 'Business Analyst',
    'Project Manager', 'Quality Assurance Engineer', 'Mobile Developer', 'other'
  ];

  const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations',
    'Human Resources', 'Finance', 'Customer Success', 'Data & Analytics',
    'Legal', 'Research & Development', 'other'
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)', 'Mid Level (2-5 years)', 
    'Senior Level (5-8 years)', 'Lead Level (8+ years)',
    'Executive Level (10+ years)'
  ];

  const educationOptions = [
    'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD', 'Professional Certification',
    'Trade School Certificate', 'No formal education required', 'other'
  ];

  const projectTypeOptions = [
    'Web Applications', 'Mobile Applications', 'E-commerce Platforms',
    'Enterprise Software', 'SaaS Applications', 'API Development',
    'Data Analytics', 'Machine Learning', 'Cloud Infrastructure',
    'Microservices', 'Desktop Applications', 'Game Development', 'other'
  ];

  const formSections = [
    {
      title: "Basic Information",
      icon: <Briefcase className="h-5 w-5" />,
      fields: [
        { 
          key: 'jobTitle', 
          label: 'Job Title', 
          type: 'select', 
          required: true,
          options: jobTitles,
          placeholder: 'Select job title'
        },
        { 
          key: 'department', 
          label: 'Department', 
          type: 'select',
          options: departments,
          placeholder: 'Select department'
        },
        { 
          key: 'experienceLevel', 
          label: 'Experience Level', 
          type: 'select', 
          required: true,
          options: experienceLevels,
          placeholder: 'Select experience level'
        }
      ]
    },
    {
      title: "Experience Requirements",
      icon: <GraduationCap className="h-5 w-5" />,
      fields: [
        { key: 'minimumExperience', label: 'Minimum Experience (years)', type: 'input', placeholder: '2' },
        { key: 'maximumExperience', label: 'Maximum Experience (years)', type: 'input', placeholder: '5' },
        { 
          key: 'education', 
          label: 'Education Requirements', 
          type: 'select',
          options: educationOptions,
          placeholder: 'Select education requirement'
        }
      ]
    },
    {
      title: "Skills & Technical Requirements",
      icon: <Code className="h-5 w-5" />,
      fields: [
        { key: 'requiredSkills', label: 'Required Skills', type: 'textarea', required: true, placeholder: 'e.g., JavaScript, React, Node.js, SQL' },
        { key: 'preferredSkills', label: 'Preferred Skills', type: 'textarea', placeholder: 'e.g., TypeScript, AWS, Docker' },
        { 
          key: 'projectTypes', 
          label: 'Relevant Project Types', 
          type: 'select',
          options: projectTypeOptions,
          placeholder: 'Select project type'
        }
      ]
    },
    {
      title: "Job Details",
      icon: <Target className="h-5 w-5" />,
      fields: [
        { key: 'jobDescription', label: 'Job Description', type: 'textarea', required: true, placeholder: 'Detailed description of the role...' },
        { key: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', placeholder: 'Main responsibilities and duties...' }
      ]
    },
    {
      title: "Output Configuration",
      icon: <Users className="h-5 w-5" />,
      fields: [
        { 
          key: 'topNCandidates', 
          label: 'Number of Top Candidates', 
          type: 'select', 
          required: true,
          options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          placeholder: 'Select number of candidates'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/upload')}>
              ← Back to Upload
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Step 2 of 4</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Description</h1>
          <p className="text-xl text-gray-600">Define the role requirements to help our AI agents find the best candidates</p>
        </div>

        <div className="space-y-6">
          {formSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  {section.icon}
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {field.type === 'input' && (
                        <Input
                          id={field.key}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-1"
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <Textarea
                          id={field.key}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="mt-1 min-h-[100px]"
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <>
                          <Select value={formData[field.key as keyof typeof formData]} onValueChange={(value) => handleInputChange(field.key, value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option, optionIndex) => (
                                <SelectItem key={optionIndex} value={option}>
                                  {option === 'other' ? 'Other (specify below)' : option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* Custom input for "other" option */}
                          {formData[field.key as keyof typeof formData] === 'other' && (
                            <Input
                              id={`custom${field.key}`}
                              value={formData[`custom${field.key.charAt(0).toUpperCase() + field.key.slice(1)}` as keyof typeof formData] || ''}
                              onChange={(e) => handleInputChange(`custom${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)}
                              placeholder={`Enter custom ${field.label.toLowerCase()}`}
                              className="mt-2"
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg"
            >
              Start AI Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
