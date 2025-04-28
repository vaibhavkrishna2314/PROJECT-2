import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Pencil } from 'lucide-react';
import { PlacesAutocomplete } from '@/components/ui/places-autocomplete';

const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  contact_person: z.string().min(1, 'Contact person is required'),
  pickup_instructions: z.string().min(1, 'Pickup instructions are required'),
  operating_hours: z.string().min(1, 'Operating hours are required'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [profileData, setProfileData] = React.useState<SettingsForm | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      address: '', // Add default value
    }
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData(data);
          reset(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data: SettingsForm) => {
    if (!user) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfileData(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset(profileData || undefined);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-charcoal">Profile Settings</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {saveError && (
        <div className="mb-4 p-4 bg-accent-coral/10 border border-accent-coral text-accent-coral rounded">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-charcoal">
            Restaurant Name
          </label>
          <input
            type="text"
            id="name"
            disabled={!isEditing}
            {...register('name')}
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-accent-coral">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-neutral-charcoal">
            Address
          </label>
          <PlacesAutocomplete
            value={watch('address')}
            onChange={(value) => setValue('address', value)}
            error={!!errors.address}
            className="disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
            disabled={!isEditing}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-accent-coral">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-charcoal">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            disabled={!isEditing}
            {...register('phone')}
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-accent-coral">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact_person" className="block text-sm font-medium text-neutral-charcoal">
            Contact Person
          </label>
          <input
            type="text"
            id="contact_person"
            disabled={!isEditing}
            {...register('contact_person')}
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
          />
          {errors.contact_person && (
            <p className="mt-1 text-sm text-accent-coral">{errors.contact_person.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="operating_hours" className="block text-sm font-medium text-neutral-charcoal">
            Operating Hours
          </label>
          <textarea
            id="operating_hours"
            rows={2}
            disabled={!isEditing}
            {...register('operating_hours')}
            placeholder="e.g., Mon-Fri: 9 AM - 10 PM, Sat-Sun: 10 AM - 11 PM"
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
          />
          {errors.operating_hours && (
            <p className="mt-1 text-sm text-accent-coral">{errors.operating_hours.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pickup_instructions" className="block text-sm font-medium text-neutral-charcoal">
            Pickup Instructions
          </label>
          <textarea
            id="pickup_instructions"
            rows={3}
            disabled={!isEditing}
            {...register('pickup_instructions')}
            placeholder="Special instructions for food pickup"
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 disabled:bg-gray-50 disabled:text-neutral-charcoal/70"
          />
          {errors.pickup_instructions && (
            <p className="mt-1 text-sm text-accent-coral">{errors.pickup_instructions.message}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};