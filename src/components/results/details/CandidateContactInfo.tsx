
import { Mail, Phone, MapPin } from "lucide-react";
import type { Candidate } from "@/types/candidates";

interface CandidateContactInfoProps {
  candidate: Candidate;
}

const CandidateContactInfo = ({ candidate }: CandidateContactInfoProps) => (
  <div className="grid md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="flex items-center text-gray-700">
        <Mail className="h-4 w-4 mr-2" />
        {candidate.email}
      </div>
      <div className="flex items-center text-gray-700">
        <Phone className="h-4 w-4 mr-2" />
        {candidate.phone}
      </div>
      <div className="flex items-center text-gray-700">
        <MapPin className="h-4 w-4 mr-2" />
        {candidate.location}
      </div>
    </div>
    <div className="space-y-2">
      <p><strong>Experience:</strong> {candidate.experienceYears} years</p>
      <p><strong>Education:</strong> {candidate.educationLevel}</p>
      <p><strong>Languages:</strong> {candidate.languages.join(', ')}</p>
    </div>
  </div>
);

export default CandidateContactInfo;
