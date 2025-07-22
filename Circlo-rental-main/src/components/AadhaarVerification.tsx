import React, { useState } from "react";
import AadhaarVerifiedBadge from "./AadhaarVerifiedBadge";

type Step = "input" | "otp" | "verifying" | "verified" | "error";

const MOCK_OTP = "123456"; // For demo purposes

const AadhaarVerification: React.FC = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string | null>(null);

  // Simulate sending OTP
  const handleSendOtp = () => {
    setError(null);
    // Aadhaar must be 12 digits
    if (!/^\d{12}$/.test(aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setStep("otp");
  };

  // Simulate verifying OTP
  const handleVerifyOtp = () => {
    setError(null);
    setStep("verifying");
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        setStep("verified");
      } else {
        setError("Invalid OTP. Please try again.");
        setStep("otp");
      }
    }, 1200);
  };

  if (step === "verified") {
    return (
      <div className="flex items-center gap-2">
        <AadhaarVerifiedBadge />
        <span className="text-green-700 font-semibold">Aadhaar Verified</span>
      </div>
    );
  }

  return (
    <div className="max-w-xs p-4 border rounded shadow bg-white">
      <h3 className="font-bold mb-2">Aadhaar Verification</h3>
      {step === "input" && (
        <>
          <input
            type="text"
            maxLength={12}
            pattern="\d{12}"
            placeholder="Enter Aadhaar number"
            value={aadhaar}
            onChange={e => setAadhaar(e.target.value.replace(/\D/g, ""))}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded w-full"
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
        </>
      )}
      {step === "otp" && (
        <>
          <div className="mb-2 text-sm text-gray-700">
            OTP sent to your registered mobile (use <b>{MOCK_OTP}</b> for demo)
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded w-full"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </>
      )}
      {step === "verifying" && (
        <div className="text-blue-600 text-center py-2">Verifying...</div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default AadhaarVerification; 