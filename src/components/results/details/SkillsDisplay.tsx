
import { Badge } from "@/components/ui/badge";

interface SkillsDisplayProps {
  technicalSkills: string[];
  softSkills: string[];
}

const SkillsDisplay = ({ technicalSkills, softSkills }: SkillsDisplayProps) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
      <div className="flex flex-wrap gap-2">
        {technicalSkills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
      <div className="flex flex-wrap gap-2">
        {softSkills.map((skill, index) => (
          <Badge key={index} variant="outline" className="px-3 py-1">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  </div>
);

export default SkillsDisplay;
