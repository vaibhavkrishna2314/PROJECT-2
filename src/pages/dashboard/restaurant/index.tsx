import React from 'react';
import { useAuth } from '@/lib/auth';
import { PlusCircle, History, Settings, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    activeListing: 0,
    totalDonations: 0,
    monthlyDonations: 0
  });
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('food_listings')
          .select('status', { count: 'exact' })
          .eq('restaurant_id', user.id);

        if (statsError) throw statsError;

        // Fetch recent listings
        const { data: listingsData, error: listingsError } = await supabase
          .from('food_listings')
          .select('*')
          .eq('restaurant_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (listingsError) throw listingsError;

        setStats({
          activeListing: statsData.filter(item => item.status === 'available').length,
          totalDonations: statsData.length,
          monthlyDonations: statsData.filter(item => {
            const date = new Date(item.created_at);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).length
        });

        setListings(listingsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statsItems = [
    { label: 'Active Listings', value: stats.activeListing, icon: Package },
    { label: 'Total Donations', value: stats.totalDonations, icon: History },
    { label: 'This Month', value: stats.monthlyDonations, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-neutral-charcoal sm:text-3xl">
              Restaurant Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button asChild>
              <Link to="/dashboard/food/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Food Listing
              </Link>
            </Button>
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

        {/* Recent Listings */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-neutral-charcoal">
                Recent Food Listings
              </h3>
              <div className="mt-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : listings.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden border border-neutral-light rounded-lg">
                          <table className="min-w-full divide-y divide-neutral-light">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                                  Food Item
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                                  Listed Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-light">
                              {listings.map((listing: any) => (
                                <tr key={listing.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                                    {listing.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                                    {listing.quantity} {listing.unit}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      listing.status === 'available' 
                                        ? 'bg-green-100 text-green-800'
                                        : listing.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                                    {new Date(listing.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-neutral-charcoal/70">
                    No food listings yet. Create your first listing!
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
                Update your restaurant's information, contact details, and preferences.
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
                View your past donations and their impact on the community.
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