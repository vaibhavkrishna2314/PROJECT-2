import React from 'react';
import { useAuth } from '@/lib/auth';
import { History, Settings, Package, TrendingUp, CheckCircle2, Search, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface FoodListing {
  id: string;
  name: string;
  food_type: string;
  description: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  pickup_location: string;
  pickup_instructions: string;
  storage_instructions?: string;
  allergens?: string;
  image_urls?: string[];
  latitude: number;
  longitude: number;
  distance?: number;
  restaurant: {
    name: string;
    address: string;
    phone: string;
  } | null;
}

interface Filters {
  foodType: string;
  maxDistance: number;
  expiryWithin: number;
}

export const NgoDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    availableListings: 0,
    acceptedDonations: 0,
    monthlyDonations: 0
  });
  const [availableListings, setAvailableListings] = React.useState<FoodListing[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = React.useState<Filters>({
    foodType: '',
    maxDistance: 50, // km
    expiryWithin: 24 // hours
  });
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setError(null);
        // Fetch available listings
        const { data: availableData, error: availableError } = await supabase
          .from('food_listings')
          .select(`
            *,
            restaurant:profiles!food_listings_restaurant_id_fkey (
              name,
              address,
              phone
            )
          `)
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (availableError) throw availableError;

        // Calculate distances and apply filters
        let filteredListings = availableData || [];
        
        if (userLocation) {
          filteredListings = filteredListings.map(listing => ({
            ...listing,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              listing.latitude,
              listing.longitude
            )
          })).filter(listing => listing.distance <= filters.maxDistance);
        }

        // Apply food type filter
        if (filters.foodType) {
          filteredListings = filteredListings.filter(
            listing => listing.food_type === filters.foodType
          );
        }

        // Apply expiry filter
        const now = new Date();
        const expiryLimit = new Date(now.getTime() + filters.expiryWithin * 60 * 60 * 1000);
        filteredListings = filteredListings.filter(
          listing => new Date(listing.expiry_date) <= expiryLimit
        );

        // Apply search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredListings = filteredListings.filter(listing =>
            listing.name.toLowerCase().includes(term) ||
            listing.description.toLowerCase().includes(term) ||
            listing.food_type.toLowerCase().includes(term)
          );
        }

        // Sort by distance if location available
        if (userLocation) {
          filteredListings.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        // Fetch accepted donations
        const { data: acceptedData, error: acceptedError } = await supabase
          .from('food_listings')
          .select('status, created_at')
          .eq('ngo_id', user.id);

        if (acceptedError) throw acceptedError;

        setAvailableListings(filteredListings);
        setStats({
          availableListings: filteredListings.length,
          acceptedDonations: acceptedData?.length || 0,
          monthlyDonations: acceptedData?.filter(item => {
            const date = new Date(item.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length || 0
        });
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, userLocation, filters, searchTerm]);

  const handleAcceptDonation = async (listingId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('food_listings')
        .update({
          status: 'pending',
          ngo_id: user.id
        })
        .eq('id', listingId);

      if (error) throw error;

      // Refresh the listings
      setAvailableListings(prevListings => 
        prevListings.filter(listing => listing.id !== listingId)
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        availableListings: prev.availableListings - 1,
        acceptedDonations: prev.acceptedDonations + 1,
        monthlyDonations: prev.monthlyDonations + 1
      }));

      // Send notification to restaurant (you'll need to implement this)
      // await sendNotification(listingId, 'claimed');
    } catch (error) {
      console.error('Error accepting donation:', error);
    }
  };

  const statsItems = [
    { label: 'Available Listings', value: stats.availableListings, icon: Package },
    { label: 'Accepted Donations', value: stats.acceptedDonations, icon: History },
    { label: 'This Month', value: stats.monthlyDonations, icon: TrendingUp },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent-coral mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-neutral-charcoal sm:text-3xl">
              NGO Dashboard
            </h2>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {statsItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary-green" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral-charcoal/70 truncate">
                          {stat.label}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-neutral-charcoal">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="mt-8 bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-charcoal/50" />
              <input
                type="text"
                placeholder="Search food listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-md border border-neutral-light"
              />
            </div>
            
            <select
              value={filters.foodType}
              onChange={(e) => setFilters(prev => ({ ...prev, foodType: e.target.value }))}
              className="rounded-md border border-neutral-light px-3 py-2"
            >
              <option value="">All Food Types</option>
              <option value="Prepared Meals">Prepared Meals</option>
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>
              <option value="Bakery">Bakery</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
              <option value="Seafood">Seafood</option>
              <option value="Dry Goods">Dry Goods</option>
              <option value="Beverages">Beverages</option>
            </select>

            <select
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
              className="rounded-md border border-neutral-light px-3 py-2"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
            </select>

            <select
              value={filters.expiryWithin}
              onChange={(e) => setFilters(prev => ({ ...prev, expiryWithin: Number(e.target.value) }))}
              className="rounded-md border border-neutral-light px-3 py-2"
            >
              <option value="6">Expires in 6 hours</option>
              <option value="12">Expires in 12 hours</option>
              <option value="24">Expires in 24 hours</option>
              <option value="48">Expires in 48 hours</option>
            </select>
          </div>
        </div>

        {/* Available Listings */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-neutral-charcoal">
                Available Food Listings
              </h3>
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : availableListings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableListings.map((listing) => (
                      <div key={listing.id} className="bg-white border rounded-lg p-4 shadow-sm">
                        {listing.image_urls && listing.image_urls.length > 0 && (
                          <img
                            src={listing.image_urls[0]}
                            alt={listing.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold text-neutral-charcoal">
                              {listing.name}
                            </h4>
                            <p className="text-sm text-neutral-charcoal/70 mt-1">
                              {listing.quantity} {listing.unit}
                            </p>
                            <span className="inline-block bg-primary-green/10 text-primary-green text-xs px-2 py-1 rounded-full mt-2">
                              {listing.food_type}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleAcceptDonation(listing.id)}
                            size="sm"
                            className="flex items-center"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-neutral-charcoal">Description</h5>
                          <p className="text-sm text-neutral-charcoal/70 mt-1">
                            {listing.description}
                          </p>
                        </div>

                        {listing.restaurant && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-neutral-charcoal">Restaurant Details</h5>
                            <div className="text-sm text-neutral-charcoal/70 mt-1">
                              <p>{listing.restaurant.name}</p>
                              <p className="mt-1">{listing.restaurant.address}</p>
                              <p className="mt-1">Phone: {listing.restaurant.phone}</p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-neutral-charcoal">Additional Info</h5>
                          <div className="text-sm text-neutral-charcoal/70 mt-1">
                            <p>Expiry: {new Date(listing.expiry_date).toLocaleDateString()}</p>
                            {listing.storage_instructions && (
                              <p className="mt-1">Storage: {listing.storage_instructions}</p>
                            )}
                            {listing.allergens && (
                              <p className="mt-1">Allergens: {listing.allergens}</p>
                            )}
                            {listing. distance !== undefined && (
                              <p className="mt-1">
                                <MapPin className="inline-block w-4 h-4 mr-1" />
                                {listing.distance.toFixed(1)} km away
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-neutral-charcoal/70">
                    No available food listings at the moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-neutral-charcoal mb-4">
                Profile Settings
              </h3>
              <p className="text-neutral-charcoal/70 mb-4">
                Update your organization's information, contact details, and preferences.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-neutral-charcoal mb-4">
                Donation History
              </h3>
              <p className="text-neutral-charcoal/70 mb-4">
                View your accepted donations and their status.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/history">
                  <History className="w-4 h-4 mr-2" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};