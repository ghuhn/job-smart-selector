
interface ProfessionalSummaryProps {
  summary: string;
}

const ProfessionalSummary = ({ summary }: ProfessionalSummaryProps) => {
  if (!summary || summary === "Professional summary not found") {
    return null;
  }
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{summary}</p>
    </div>
  );
};

export default ProfessionalSummary;
