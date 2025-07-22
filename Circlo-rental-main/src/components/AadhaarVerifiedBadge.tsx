import React from "react";

const AadhaarVerifiedBadge: React.FC = () => (
  <span
    title="Aadhaar Verified"
    className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full"
  >
    <svg
      className="w-3 h-3 mr-1 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    Aadhaar Verified
  </span>
);

export default AadhaarVerifiedBadge; 