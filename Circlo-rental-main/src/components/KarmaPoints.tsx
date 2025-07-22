import React from "react";
import { Award } from 'lucide-react';

interface KarmaPointsProps {
  points: number;
}

const KarmaPoints: React.FC<KarmaPointsProps> = ({ points }) => (
  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
    <Award className="w-5 h-5 text-yellow-500" />
    <span className="font-bold text-yellow-800 text-lg">{points}</span>
    <span className="text-yellow-700 text-sm">Karma Points</span>
  </div>
);

export default KarmaPoints; 