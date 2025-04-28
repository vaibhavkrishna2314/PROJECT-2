import React from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const DonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('food_listings')
          .select(`
            *,
            ngo:ngo_id (
              name
            )
          `)
          .eq('restaurant_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDonations(data || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-neutral-charcoal mb-6">Donation History</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {donations.length > 0 ? (
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
                  NGO
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-charcoal/70 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-light">
              {donations.map((donation: any) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                    {donation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                    {donation.quantity} {donation.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                    {donation.ngo?.name || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-charcoal">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-neutral-charcoal/70">
            No donation history yet.
          </div>
        )}
      </div>
    </div>
  );
};