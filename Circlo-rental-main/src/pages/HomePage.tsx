import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Search, ArrowRight, Star, Shield, Heart, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { listings } = useApp();

  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      count: listings.filter(l => l.category === 'Electronics').length,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Fashion',
      icon: '👗',
      count: listings.filter(l => l.category === 'Fashion').length,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      name: 'Tools',
      icon: '🔧',
      count: listings.filter(l => l.category === 'Tools').length,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Culture',
      icon: '🎨',
      count: listings.filter(l => l.isVaultItem).length,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const featuredListings = listings.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Rent, Lend, <span className="text-yellow-300">Connect</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover unique items from your community. From everyday essentials to rare treasures, 
              everything you need is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/listings"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Start Renting</span>
              </Link>
              <Link
                to={user ? "/add-listing" : "/login"}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>List Your Item</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">10K+</div>
                <div className="text-blue-100">Items Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">5K+</div>
                <div className="text-blue-100">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-blue-100">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From tech gadgets to vintage treasures, find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/listings?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Items
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked items from our community
              </p>
            </div>
            <Link
              to="/listings"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-gray-900">₹{listing.price}</span>
                      <span className="text-gray-500">/{listing.priceUnit}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{listing.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Vault Preview */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The Cultural Vault
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Discover rare and unique items with fascinating stories. Each piece in our vault 
              carries history, culture, and extraordinary experiences.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold mb-4">Curated Treasures</h3>
            <p className="text-purple-100 mb-6 max-w-xl mx-auto">
              From vintage cameras used by famous photographers to designer pieces worn by celebrities, 
              explore items that tell incredible stories.
            </p>
            <Link
              to="/cultural-vault"
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors inline-flex items-center space-x-2"
            >
              <span>Explore the Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Circlo Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, safe, and secure. Start renting or lending in just a few clicks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Browse & Discover</h3>
              <p className="text-gray-600">
                Explore thousands of items from your local community. Use filters to find exactly what you need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Book Securely</h3>
              <p className="text-gray-600">
                Connect with item owners, check availability, and book with confidence. All transactions are protected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Enjoy & Share</h3>
              <p className="text-gray-600">
                Use the item for your project or event, then rate your experience and build community karma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built on Trust & Community
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Verified Users</h3>
                    <p className="text-gray-600">All users are verified through our comprehensive identity and background check process.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Karma System</h3>
                    <p className="text-gray-600">Build trust through our karma point system. Great renters and lenders earn rewards and recognition.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Support</h3>
                    <p className="text-gray-600">Join a community that values sharing, sustainability, and meaningful connections.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h3>
                <p className="text-gray-600">
                  Start building your karma and connecting with amazing people in your neighborhood.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">99%</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;