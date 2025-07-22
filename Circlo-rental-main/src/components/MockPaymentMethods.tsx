import React from "react";

const paymentOptions = [
  { label: "UPI", value: "upi" },
  { label: "Credit/Debit Card", value: "card" },
  { label: "Net Banking", value: "netbanking" },
  { label: "Wallet", value: "wallet" },
];

interface MockPaymentMethodsProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const MockPaymentMethods: React.FC<MockPaymentMethodsProps> = ({ selectedMethod, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
      <div className="flex gap-4 flex-wrap">
        {paymentOptions.map(opt => (
          <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 border rounded cursor-pointer ${selectedMethod === opt.value ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value={opt.value}
              checked={selectedMethod === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-blue-600"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <div className="mt-4">
        {selectedMethod === "upi" && (
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. name@bank)"
            className="w-full border rounded px-3 py-2"
          />
        )}
        {selectedMethod === "card" && (
          <div className="space-y-2">
            <input type="text" placeholder="Card Number" className="w-full border rounded px-3 py-2" />
            <div className="flex gap-2">
              <input type="text" placeholder="MM/YY" className="w-1/2 border rounded px-3 py-2" />
              <input type="text" placeholder="CVV" className="w-1/2 border rounded px-3 py-2" />
            </div>
            <input type="text" placeholder="Name on Card" className="w-full border rounded px-3 py-2" />
          </div>
        )}
        {selectedMethod === "netbanking" && (
          <select className="w-full border rounded px-3 py-2">
            <option value="">Select Bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="kotak">Kotak Mahindra Bank</option>
          </select>
        )}
        {selectedMethod === "wallet" && (
          <select className="w-full border rounded px-3 py-2">
            <option value="">Select Wallet</option>
            <option value="paytm">Paytm</option>
            <option value="phonepe">PhonePe</option>
            <option value="amazonpay">Amazon Pay</option>
            <option value="mobikwik">Mobikwik</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default MockPaymentMethods; 