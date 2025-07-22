import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Award, Star, MapPin, Calendar } from 'lucide-react';

const CulturalVaultPage: React.FC = () => {
  const { listings } = useApp();
  
  const vaultItems = listings.filter(listing => listing.isVaultItem);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🏛️</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              The Cultural Vault
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Discover extraordinary items with fascinating stories. Each piece in our vault carries history, 
              culture, and remarkable experiences that connect us to the past and inspire the future.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{vaultItems.length}</div>
              <div className="text-gray-600">Vault Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Years of History</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-gray-600">Cultural Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Stories Worth Telling
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every vault item comes with a unique story that makes renting more than just a transaction
            </p>
          </div>

          {vaultItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vault items yet</h3>
              <p className="text-gray-600">Check back soon for amazing cultural treasures!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {vaultItems.map((item, index) => (
                <div key={item.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                  <div className="flex-1">
                    <Link to={`/listings/${item.id}`} className="group">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>Vault Item</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-semibold">{item.rating}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-purple-900 mb-3">The Story</h4>
                      <p className="text-purple-800 leading-relaxed">{item.vaultStory}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                        <span className="text-gray-500">per {item.priceUnit}</span>
                      </div>
                      <Link
                        to={`/listings/${item.id}`}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Explore Item
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Vault Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How the Vault Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our Cultural Vault celebrates items with extraordinary stories and cultural significance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curation</h3>
              <p className="text-gray-600">
                Items are carefully selected for their historical significance, cultural value, or unique provenance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Storytelling</h3>
              <p className="text-gray-600">
                Each vault item comes with a detailed story about its history, previous owners, or cultural impact.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience</h3>
              <p className="text-gray-600">
                Renting a vault item means participating in its ongoing story and becoming part of its journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Have a Cultural Treasure?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            If you own an item with an extraordinary story, we'd love to feature it in our Cultural Vault. 
            Share history and earn premium rates for your unique treasures.
          </p>
          <Link
            to="/add-listing"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-block"
          >
            Submit Your Item
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CulturalVaultPage;