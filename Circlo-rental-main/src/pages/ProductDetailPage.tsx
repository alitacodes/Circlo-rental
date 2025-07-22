import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Shield, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Share2,
  Award
} from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import CulturalVaultBadge from '../components/CulturalVaultBadge';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { listings } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviews, setReviews] = useState<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Mock: completed bookings for this user and item
  const completedBookings = [
    { userId: user?.id, listingId: listings.find(l => l.id === id)?.id }
    // Add more mock bookings as needed
  ];

  // Check if user can review
  const canReview =
    user &&
    listings.find(l => l.id === id) &&
    completedBookings.some(
      b => b.userId === user.id && b.listingId === id
    ) &&
    !reviews.some(r => r.name === user.name); // or use user.id if available

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

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/listings" className="hover:text-blue-600">Listings</Link>
          <span>/</span>
          <span className="text-gray-900">{listing.title}</span>
        </nav>

        {/* Report a Problem Button & Form */}
        <div className="flex justify-end mb-4">
          {!reportSubmitted ? (
            showReportForm ? (
              <form
                className="bg-white border rounded-lg shadow p-4 w-full max-w-md"
                onSubmit={e => {
                  e.preventDefault();
                  setReportSubmitted(true);
                }}
              >
                <h3 className="text-lg font-semibold mb-2">Report a Problem</h3>
                <label className="block mb-2 text-sm font-medium">Reason</label>
                <select
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="not_described">Item not as described</option>
                  <option value="unresponsive">Owner unresponsive</option>
                  <option value="damaged">Item was damaged</option>
                  <option value="other">Other</option>
                </select>
                <label className="block mb-2 text-sm font-medium">Description</label>
                <textarea
                  className="border rounded px-3 py-2 w-full mb-3"
                  rows={3}
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="Describe the issue..."
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => setShowReportForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 border border-red-200"
                onClick={() => setShowReportForm(true)}
              >
                Report a Problem
              </button>
            )
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow w-full max-w-md text-center">
              Thank you! Your report has been submitted.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
              
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {listing.isVaultItem && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Vault Item</span>
                </div>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-full shadow-lg transition-all ${
                    isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {listing.category}
                </span>
                {listing.isVaultItem && (
                  <span className="ml-2">
                    <CulturalVaultBadge />
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-gray-500">({listing.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{listing.description}</p>
            </div>

            {/* Vault Story */}
            {listing.isVaultItem && listing.vaultStory && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">Cultural Story</h3>
                </div>
                <p className="text-purple-800">{listing.vaultStory}</p>
              </div>
            )}

            {/* Price and Location */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">₹{listing.price}</span>
                    <span className="text-gray-500">per {listing.priceUnit}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1 text-green-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Available Now</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Insured</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBookNow}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Owner</h3>
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
                <Link
                  to="/chat"
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Message
                </Link>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              <ReviewList reviews={reviews} />
              {canReview && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
                  <ReviewForm
                    onSubmit={({ rating, comment }) => {
                      if (!user) return;
                      setReviews(prev => [
                        {
                          name: user.name,
                          rating,
                          comment,
                          date: new Date().toLocaleDateString(),
                        },
                        ...prev,
                      ]);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;