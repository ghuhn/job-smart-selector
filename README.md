
# JobDeskAI - Multi-Agent Resume Screener

An enterprise-grade AI-powered resume screening and candidate recommendation system built with React, TypeScript, and Google's Gemini AI.

## 🚀 Features

### Core Functionality
- **Smart Resume Upload**: Drag-and-drop interface supporting PDF and DOCX files
- **Job Description Builder**: Comprehensive form for defining role requirements
- **Multi-Agent AI Analysis**: Four specialized AI agents working in orchestration
- **Top 3 Recommendations**: Ranked candidates with detailed explanations
- **Download Reports**: Export summaries and detailed analysis reports
- **Responsive Design**: Professional, enterprise-ready interface

### AI Multi-Agent System
1. **Recruiter Agent**: Extracts education, skills, tools, and experience from resumes
2. **Analyst Agent**: Matches extracted features to job description using scoring algorithm
3. **HR Agent**: Evaluates tone, soft skills, and identifies potential red flags
4. **Recommender Agent**: Ranks resumes and suggests top 3 candidates for the role

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **AI Integration**: Google Gemini Pro API
- **Icons**: Lucide React
- **Animations**: CSS transitions and Tailwind animations

## 📱 Application Flow

1. **Landing Page**: Beautiful hero section with feature overview
2. **Upload Page**: Drag-and-drop resume upload with file validation
3. **Job Description**: Comprehensive form for role requirements
4. **Processing Page**: Real-time AI agent status with progress tracking
5. **Results Page**: Detailed candidate analysis with rankings and insights

## 🎨 Design System

- **Color Palette**: Professional blues, purples, and grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Card-based design with proper spacing
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd job-desk-ai-screener
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 🔑 API Configuration

The application uses Google's Gemini Pro API for AI processing. The API key is currently embedded for demo purposes, but for production use:

1. Create a `.env` file (not included in this template)
2. Add your Gemini API key: `VITE_GEMINI_API_KEY=your_api_key_here`
3. Update `src/utils/geminiApi.ts` to use the environment variable

## 📊 Scoring Algorithm

The AI agents evaluate candidates across multiple dimensions:

- **Technical Skills** (0-100): Match with required technologies
- **Experience Level** (0-100): Relevant work experience assessment
- **Education** (0-100): Educational background alignment
- **Communication** (0-100): Writing style and presentation quality
- **Cultural Fit** (0-100): Alignment with company values and role

## 🚀 Deployment

The application is ready for deployment on any modern hosting platform:

- **Vercel**: `npm run build` then upload dist folder
- **Netlify**: Connect repository for automatic deployments
- **GitHub Pages**: Use GitHub Actions for automated builds

## 🎯 Future Enhancements

- **Feedback Agent**: Learn from rejected candidates to improve logic
- **Resume Parsing**: Direct PDF/DOCX text extraction
- **Vector Search**: Semantic similarity matching
- **Interview Scheduling**: Integration with calendar systems
- **Analytics Dashboard**: Hiring metrics and insights

## 📄 License

This project is built for educational and demonstration purposes. Please ensure compliance with data privacy regulations when processing real candidate information.

## 🤝 Contributing

This is a capstone project demonstrating enterprise-level development practices. The codebase follows modern React patterns and is designed for scalability and maintainability.

---

**Built with ❤️ using React, TypeScript, and AI**
