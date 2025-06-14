
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/types/candidates";

interface ProjectsListProps {
  projects: Candidate['projects'];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  if (projects.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Key Projects</h3>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{project.name}</h4>
            <p className="text-gray-700 text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies.map((tech, techIndex) => (
                <Badge key={techIndex} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
