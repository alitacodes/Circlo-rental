import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Shield, 
  CreditCard, 
  Clock,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import CostBreakdown from '../components/CostBreakdown';
import MockPaymentMethods from '../components/MockPaymentMethods';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listings } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/listings" className="text-blue-600 hover:text-blue-700">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to book</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1;
    
    let multiplier = days;
    if (listing.priceUnit === 'hour') {
      multiplier = days * 24; // Assume 24 hours per day for hourly rentals
    } else if (listing.priceUnit === 'week') {
      multiplier = Math.ceil(days / 7);
    }
    
    return listing.price * multiplier;
  };

  const serviceFee = calculateTotal() * 0.1; // 10% service fee
  const total = calculateTotal() + serviceFee;

  const handleBooking = async () => {
    if (!startDate || !endDate) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your rental request for <strong>{listing.title}</strong> has been sent to the owner. 
            You'll receive a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
            >
              View My Bookings
            </Link>
            <Link
              to="/chat"
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors block"
            >
              Message Owner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            <p className="text-gray-600">Review details and confirm your rental</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Item Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {listing.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{listing.rating}</span>
                    <span className="text-gray-500">({listing.reviewCount})</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-4">{listing.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Insured</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Owner</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={listing.ownerAvatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={listing.ownerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{listing.ownerName}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>4.9 rating</span>
                    </div>
                    <span>128 reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="pickup"
                      checked={deliveryOption === 'pickup'}
                      onChange={() => setDeliveryOption('pickup')}
                    />
                    Pickup
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value="delivery"
                      checked={deliveryOption === 'delivery'}
                      onChange={() => setDeliveryOption('delivery')}
                    />
                    Delivery
                  </label>
                </div>
              </div>
              {/* CostBreakdown Add-on */}
              {startDate && endDate && (
                <CostBreakdown
                  rentalPricePerDay={listing.price}
                  startDate={new Date(startDate)}
                  endDate={new Date(endDate)}
                  securityDeposit={listing.securityDeposit || 0}
                  deliveryOption={deliveryOption}
                  deliveryFee={listing.deliveryFee || 100}
                  platformServiceFeeRate={0.1}
                  discountCode={discountCode}
                  onDiscountCodeChange={setDiscountCode}
                />
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <MockPaymentMethods
                selectedMethod={paymentMethod}
                onChange={setPaymentMethod}
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Payment Protection</p>
                    <p>Your payment is protected. You'll only be charged after the owner confirms your booking.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!startDate || !endDate || isProcessing}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Confirm & Pay ₹{total.toFixed(2)}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By confirming, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;