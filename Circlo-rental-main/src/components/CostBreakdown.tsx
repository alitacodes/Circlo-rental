import React, { useMemo } from "react";

interface CostBreakdownProps {
  rentalPricePerDay: number;
  startDate: Date;
  endDate: Date;
  securityDeposit?: number;
  deliveryOption: "pickup" | "delivery";
  deliveryFee?: number;
  platformServiceFeeRate: number;
  discountCode?: string;
  onDiscountCodeChange?: (code: string) => void;
}

const VALID_DISCOUNT = "CIRCLO10";
const DISCOUNT_AMOUNT = 100; // Flat ₹100 off for demo
const DISCOUNT_PLATFORM_FEE = 0.5; // 50% off platform fee for demo

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  rentalPricePerDay,
  startDate,
  endDate,
  securityDeposit = 0,
  deliveryOption,
  deliveryFee = 0,
  platformServiceFeeRate,
  discountCode = "",
  onDiscountCodeChange,
}) => {
  // Calculate rental days (inclusive)
  const totalDays = useMemo(() => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
    return Math.max(diff, 1);
  }, [startDate, endDate]);

  const baseCost = rentalPricePerDay * totalDays;

  // Platform fee
  let platformFee = baseCost * platformServiceFeeRate;
  let discount = 0;
  let discountNote = "";
  if (discountCode === VALID_DISCOUNT) {
    // For demo: apply both a flat discount and a platform fee reduction
    platformFee = platformFee * DISCOUNT_PLATFORM_FEE;
    discount = DISCOUNT_AMOUNT;
    discountNote = `Discount code applied: -₹${DISCOUNT_AMOUNT} & 50% off platform fee`;
  }

  // Delivery fee
  const delivery = deliveryOption === "delivery" ? deliveryFee : 0;

  // Total
  const total = Math.max(baseCost + platformFee + delivery + securityDeposit - discount, 0);

  return (
    <div className="bg-white border rounded-lg p-6 max-w-md space-y-3">
      <h3 className="text-lg font-bold mb-2">Cost Breakdown</h3>
      <div className="flex justify-between text-sm">
        <span>Rental duration:</span>
        <span>{totalDays} day{totalDays > 1 ? "s" : ""}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Base rental amount:</span>
        <span>₹{baseCost.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Platform fee (@{Math.round(platformServiceFeeRate * 100)}%):</span>
        <span>₹{platformFee.toLocaleString()}</span>
      </div>
      {delivery > 0 && (
        <div className="flex justify-between text-sm">
          <span>Delivery fee:</span>
          <span>₹{delivery.toLocaleString()}</span>
        </div>
      )}
      {securityDeposit > 0 && (
        <div className="flex justify-between text-sm">
          <span>Refundable security deposit:</span>
          <span>₹{securityDeposit.toLocaleString()}</span>
        </div>
      )}
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-700">
          <span>Discount:</span>
          <span>-₹{discount.toLocaleString()}</span>
        </div>
      )}
      <div className="border-t pt-3 flex justify-between font-bold text-base">
        <span>Total to Pay Now:</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Security deposit is fully refundable upon safe return.
      </div>
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Discount code</label>
        <input
          type="text"
          value={discountCode}
          onChange={e => onDiscountCodeChange && onDiscountCodeChange(e.target.value)}
          placeholder="Enter code (try CIRCLO10)"
          className="w-full border rounded px-2 py-1 text-sm"
        />
        {discountNote && <div className="text-green-700 text-xs mt-1">{discountNote}</div>}
      </div>
    </div>
  );
};

export default CostBreakdown; 