
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Users, Search, Download, Zap, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  console.log("Index page is rendering...");
  
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileUp className="h-8 w-8 text-blue-600" />,
      title: "Smart Upload",
      description: "Upload multiple resumes with drag-and-drop functionality"
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      title: "AI Analysis",
      description: "Multi-agent system analyzes skills, experience, and fit"
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "Top Recommendations",
      description: "Get ranked recommendations with detailed explanations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                JobDeskAI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-600">Multi-Agent Resume Screener</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Zap className="h-12 w-12 text-white" />
              </div>
              <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                JobDeskAI
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Resume
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Screening
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your hiring process with intelligent multi-agent analysis. 
            Upload resumes, define your requirements, and get the top 3 candidates ranked with detailed insights.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Start Screening Process
            <FileUp className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Resumes", desc: "Bulk upload PDF/DOCX files" },
              { step: "2", title: "Define Job Role", desc: "Specify requirements and criteria" },
              { step: "3", title: "AI Processing", desc: "Multi-agent analysis in action" },
              { step: "4", title: "Get Results", desc: "Top 3 ranked candidates with insights" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 JobDeskAI. Enterprise-grade AI recruitment solution.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
