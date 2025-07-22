import React from "react";
import { Award } from 'lucide-react';

const CulturalVaultBadge: React.FC = () => (
  <span
    title="Cultural Vault Item"
    className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full"
  >
    <Award className="w-3 h-3 mr-1 text-purple-600" />
    Cultural Vault
  </span>
);

export default CulturalVaultBadge; 