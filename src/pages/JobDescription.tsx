
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, GraduationCap, Code, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JobDescription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    experienceLevel: '',
    minimumExperience: '',
    maximumExperience: '',
    requiredSkills: '',
    preferredSkills: '',
    education: '',
    jobDescription: '',
    responsibilities: '',
    projectTypes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['jobTitle', 'experienceLevel', 'requiredSkills', 'jobDescription'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Store job description data
    localStorage.setItem('jobDescription', JSON.stringify(formData));
    navigate('/processing');
  };

  const formSections = [
    {
      title: "Basic Information",
      icon: <Briefcase className="h-5 w-5" />,
      fields: [
        { key: 'jobTitle', label: 'Job Title', type: 'input', required: true, placeholder: 'e.g., Senior Software Engineer' },
        { key: 'department', label: 'Department', type: 'input', placeholder: 'e.g., Engineering, Marketing' },
        { 
          key: 'experienceLevel', 
          label: 'Experience Level', 
          type: 'select', 
          required: true,
          options: ['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5-8 years)', 'Lead Level (8+ years)']
        }
      ]
    },
    {
      title: "Experience Requirements",
      icon: <GraduationCap className="h-5 w-5" />,
      fields: [
        { key: 'minimumExperience', label: 'Minimum Experience (years)', type: 'input', placeholder: '2' },
        { key: 'maximumExperience', label: 'Maximum Experience (years)', type: 'input', placeholder: '5' },
        { key: 'education', label: 'Education Requirements', type: 'input', placeholder: 'e.g., Bachelor\'s in Computer Science' }
      ]
    },
    {
      title: "Skills & Technical Requirements",
      icon: <Code className="h-5 w-5" />,
      fields: [
        { key: 'requiredSkills', label: 'Required Skills', type: 'textarea', required: true, placeholder: 'e.g., JavaScript, React, Node.js, SQL' },
        { key: 'preferredSkills', label: 'Preferred Skills', type: 'textarea', placeholder: 'e.g., TypeScript, AWS, Docker' },
        { key: 'projectTypes', label: 'Relevant Project Types', type: 'textarea', placeholder: 'e.g., E-commerce platforms, SaaS applications' }
      ]
    },
    {
      title: "Job Details",
      icon: <Target className="h-5 w-5" />,
      fields: [
        { key: 'jobDescription', label: 'Job Description', type: 'textarea', required: true, placeholder: 'Detailed description of the role...' },
        { key: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', placeholder: 'Main responsibilities and duties...' }
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
                        <Select value={formData[field.key as keyof typeof formData]} onValueChange={(value) => handleInputChange(field.key, value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option, optionIndex) => (
                              <SelectItem key={optionIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
