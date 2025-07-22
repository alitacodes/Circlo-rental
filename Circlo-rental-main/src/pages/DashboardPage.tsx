import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  Calendar, 
  Star, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Plus,
  Award,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import AadhaarVerification from '../components/AadhaarVerification';
import KarmaPoints from '../components/KarmaPoints';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { listings, deleteListing } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const userListings = listings.filter(listing => listing.ownerId === user.id);
  const totalEarnings = userListings.reduce((sum, listing) => sum + (listing.price * 5), 0); // Mock calculation
  const activeListings = userListings.length;
  const totalBookings = 23; // Mock data

  // Mock bookings data
  const mockBookings = [
    {
      id: 'b1',
      itemTitle: 'Canon EOS R5 Camera',
      itemImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
      startDate: '2024-07-10',
      endDate: '2024-07-12',
      status: 'confirmed',
    },
    {
      id: 'b2',
      itemTitle: 'Designer Evening Gown',
      itemImage: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=100',
      startDate: '2024-07-15',
      endDate: '2024-07-16',
      status: 'pending',
    },
    {
      id: 'b3',
      itemTitle: 'Vintage Leica M6',
      itemImage: 'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=100',
      startDate: '2024-06-20',
      endDate: '2024-06-22',
      status: 'completed',
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'listings', name: 'My Listings', icon: Package },
    { id: 'bookings', name: 'My Bookings', icon: Calendar },
    { id: 'messages', name: 'Messages', icon: MessageCircle },
    { id: 'profile', name: 'Profile', icon: User }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileForm(prev => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingProfile(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{activeListings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Karma Points</p>
              <p className="text-2xl font-bold text-gray-900">{user.karmaPoints}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-sm text-gray-500">Canon EOS R5 Camera rental - ₹85</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New booking request</p>
                <p className="text-sm text-gray-500">Professional Power Drill Set</p>
              </div>
              <span className="text-sm text-gray-500">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New review received</p>
                <p className="text-sm text-gray-500">5 stars for Designer Evening Gown</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
        <Link
          to="/add-listing"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </Link>
      </div>

      {userListings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Start earning by listing your first item</p>
          <Link
            to="/add-listing"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>List Your First Item</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                {listing.isVaultItem && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Vault Item
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold">{listing.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-900">₹{listing.price}</span>
                    <span className="text-gray-500 text-sm">/{listing.priceUnit}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {listing.category}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/listings/${listing.id}`}
                    className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors text-center"
                  >
                    View
                  </Link>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteListing(listing.id)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h3>
      {mockBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start booking items to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <img
                src={booking.itemImage}
                alt={booking.itemTitle}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-semibold text-gray-900 mb-1">{booking.itemTitle}</h4>
                <div className="text-sm text-gray-600 mb-2">
                  {booking.startDate} to {booking.endDate}
                </div>
                <div className="mt-auto">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Karma Points Display */}
      <KarmaPoints points={user.karmaPoints || 0} />
      {/* Referral Program Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Referral Program</h3>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-gray-100 px-3 py-1 rounded text-blue-700 text-lg select-all">CIRCLO1234</span>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              onClick={() => navigator.clipboard.writeText('CIRCLO1234')}
            >
              Copy
            </button>
          </div>
          <span className="text-gray-500 text-sm ml-2">Share this code with friends to earn bonus karma!</span>
        </div>
        <form
          className="flex flex-col sm:flex-row gap-2 mb-4"
          onSubmit={e => { e.preventDefault(); }}
        >
          <input
            type="email"
            placeholder="Friend's email"
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Invite
          </button>
        </form>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">Your Referrals</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <span className="font-medium">Amit Sharma</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">+50 Karma</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">Priya Patel</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">+50 Karma</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {editingProfile ? (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <img
                  src={profileForm.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={profileForm.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full shadow hover:bg-blue-700"
                  title="Change avatar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6M6 18v-2a2 2 0 012-2h8a2 2 0 012 2v2" /></svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileChange}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setEditingProfile(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{user.karmaPoints} Karma Points</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setEditingProfile(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>
            {/* Public Profile Preview */}
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-800">Karma: {user.karmaPoints}</span>
                  {/* Add Aadhaar badge, reviews, etc. here */}
                </div>
                <div className="text-xs text-gray-500 mt-1">{user.email}</div>
              </div>
            </div>
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{activeListings}</div>
            <div className="text-sm text-gray-600">Items Listed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">4.9</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-sm text-gray-600">Completed Rentals</div>
          </div>
        </div>
      </div>
      <AadhaarVerification />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'listings':
        return renderListings();
      case 'bookings':
        return renderBookings();
      case 'messages':
        return <div className="p-6">Go to the Messages tab to chat with other users.</div>;
      case 'profile':
        return renderProfile();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your listings, bookings, and profile</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage;