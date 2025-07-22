import React, { createContext, useContext, useState } from 'react';

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'day' | 'hour' | 'week';
  images: string[];
  location: string;
  availability: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  rating: number;
  reviewCount: number;
  isVaultItem?: boolean;
  vaultStory?: string;
  createdAt: string;
}

interface AppContextType {
  listings: ListingItem[];
  addListing: (listing: Omit<ListingItem, 'id' | 'createdAt'>) => void;
  updateListing: (id: string, updates: Partial<ListingItem>) => void;
  deleteListing: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [listings, setListings] = useState<ListingItem[]>([
    {
      id: '1',
      title: 'Canon EOS R5 Camera',
      description: 'Professional mirrorless camera with 45MP full-frame sensor. Perfect for photography and videography projects.',
      category: 'Electronics',
      price: 85,
      priceUnit: 'day',
      images: [
        'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      location: 'Manhattan, NY',
      availability: ['2024-01-15', '2024-01-16', '2024-01-17'],
      ownerId: '2',
      ownerName: 'Sarah Chen',
      ownerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      reviewCount: 127,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Vintage Leica M6 Film Camera',
      description: 'Legendary 35mm rangefinder camera from 1984. A masterpiece of German engineering with incredible build quality.',
      category: 'Electronics',
      price: 120,
      priceUnit: 'day',
      images: [
        'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      location: 'Brooklyn, NY',
      availability: ['2024-01-18', '2024-01-19', '2024-01-20'],
      ownerId: '3',
      ownerName: 'Marcus Johnson',
      ownerAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5.0,
      reviewCount: 89,
      isVaultItem: true,
      vaultStory: 'This particular Leica M6 belonged to renowned street photographer Henri Cartier-Bresson and was used to capture some of his most iconic images in the 1980s.',
      createdAt: '2024-01-08'
    },
    {
      id: '3',
      title: 'Designer Evening Gown',
      description: 'Elegant black evening gown by Valentino. Size 6, perfect for formal events, galas, and special occasions.',
      category: 'Fashion',
      price: 200,
      priceUnit: 'day',
      images: [
        'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      location: 'Upper East Side, NY',
      availability: ['2024-01-25', '2024-01-26'],
      ownerId: '4',
      ownerName: 'Isabella Rodriguez',
      ownerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.8,
      reviewCount: 45,
      createdAt: '2024-01-12'
    },
    {
      id: '4',
      title: 'Professional Power Drill Set',
      description: 'Heavy-duty cordless drill with complete bit set. Perfect for home improvement projects and professional construction work.',
      category: 'Tools',
      price: 25,
      priceUnit: 'day',
      images: [
        'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      location: 'Queens, NY',
      availability: ['2024-01-20', '2024-01-21', '2024-01-22'],
      ownerId: '5',
      ownerName: 'David Kim',
      ownerAvatar: 'https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.7,
      reviewCount: 203,
      createdAt: '2024-01-05'
    }
  ]);

  const addListing = (listing: Omit<ListingItem, 'id' | 'createdAt'>) => {
    const newListing: ListingItem = {
      ...listing,
      id: Math.random().toString(),
      createdAt: new Date().toISOString()
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<ListingItem>) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  return (
    <AppContext.Provider value={{
      listings,
      addListing,
      updateListing,
      deleteListing,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};