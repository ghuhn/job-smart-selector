
import { Badge } from "@/components/ui/badge";

interface CertificationsListProps {
  certifications: string[];
}

const CertificationsList = ({ certifications }: CertificationsListProps) => {
  if (certifications.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Certifications</h3>
      <div className="flex flex-wrap gap-2">
        {certifications.map((cert, index) => (
          <Badge key={index} className="px-3 py-1 bg-purple-100 text-purple-800">
            {cert}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CertificationsList;
