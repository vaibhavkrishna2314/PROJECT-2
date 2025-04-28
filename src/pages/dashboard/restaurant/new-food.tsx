import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock, AlertCircle, Upload, X } from 'lucide-react';
import { PlacesAutocomplete } from '@/components/ui/places-autocomplete';
import { foodTypes, foodListingSchema, type FoodListingForm } from '@/lib/types';

export const NewFoodListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const { register, control, handleSubmit, setValue, formState: { errors }, watch } = useForm<FoodListingForm>({
    resolver: zodResolver(foodListingSchema),
    defaultValues: {
      pickupLocation: '',
      latitude: 0,
      longitude: 0,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    }
  });

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please ensure location services are enabled.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, [setValue]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const newImageUrls = [];
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${timestamp}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('food-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('food-images')
          .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
      }

      setImageUrls(prev => [...prev, ...newImageUrls]);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FoodListingForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('food_listings')
        .insert([
          {
            restaurant_id: user.id,
            name: data.name,
            food_type: data.foodType,
            description: data.description,
            quantity: data.quantity,
            unit: data.unit,
            expiry_date: data.expiryDate,
            pickup_location: data.pickupLocation,
            pickup_instructions: data.pickupInstructions,
            storage_instructions: data.storageInstructions,
            allergens: data.allergens,
            image_urls: imageUrls,
            latitude: data.latitude,
            longitude: data.longitude,
            status: 'available',
          },
        ]);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating food listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-charcoal mb-6">Create New Food Listing</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {locationError && (
          <div className="bg-accent-coral/10 border border-accent-coral text-accent-coral px-4 py-3 rounded relative">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{locationError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-charcoal">
              Food Item Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-accent-coral">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="foodType" className="block text-sm font-medium text-neutral-charcoal">
              Food Type
            </label>
            <select
              id="foodType"
              {...register('foodType')}
              className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
            >
              <option value="">Select food type</option>
              {foodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.foodType && (
              <p className="mt-1 text-sm text-accent-coral">{errors.foodType.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-charcoal">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-accent-coral">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-neutral-charcoal">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              step="0.01"
              {...register('quantity', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-accent-coral">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-neutral-charcoal">
              Unit
            </label>
            <select
              id="unit"
              {...register('unit')}
              className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
            >
              <option value="">Select unit</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="l">Liters (l)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="portions">Portions</option>
              <option value="pieces">Pieces</option>
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-accent-coral">{errors.unit.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-charcoal">
            Expiry Date & Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-charcoal/50" />
            <Controller
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  className="mt-1 block w-full rounded-md border border-neutral-light pl-10 pr-3 py-2"
                />
              )}
            />
          </div>
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-accent-coral">{errors.expiryDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-neutral-charcoal">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-charcoal/50" />
            <PlacesAutocomplete
              value={watch('pickupLocation')}
              onChange={(value, lat, lng) => {
                setValue('pickupLocation', value);
                if (lat && lng) {
                  setValue('latitude', lat);
                  setValue('longitude', lng);
                }
              }}
              error={!!errors.pickupLocation}
              className="pl-10"
            />
          </div>
          {errors.pickupLocation && (
            <p className="mt-1 text-sm text-accent-coral">{errors.pickupLocation.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pickupInstructions" className="block text-sm font-medium text-neutral-charcoal">
            Pickup Instructions
          </label>
          <textarea
            id="pickupInstructions"
            rows={2}
            {...register('pickupInstructions')}
            placeholder="E.g., Enter through the back door, ask for kitchen staff"
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
          />
          {errors.pickupInstructions && (
            <p className="mt-1 text-sm text-accent-coral">{errors.pickupInstructions.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="storageInstructions" className="block text-sm font-medium text-neutral-charcoal">
            Storage Instructions
          </label>
          <textarea
            id="storageInstructions"
            rows={2}
            {...register('storageInstructions')}
            placeholder="E.g., Keep refrigerated at 4°C"
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="allergens" className="block text-sm font-medium text-neutral-charcoal">
            Allergens
          </label>
          <input
            type="text"
            id="allergens"
            {...register('allergens')}
            placeholder="e.g., nuts, dairy, gluten"
            className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-charcoal mb-2">
            Images
          </label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-green hover:text-primary-green/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-green">
              <div className="px-4 py-2 border border-neutral-light rounded-md flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span>Upload Images</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="sr-only"
              />
            </label>
            {uploadingImage && (
              <span className="ml-3 text-sm text-neutral-charcoal/70">
                Uploading...
              </span>
            )}
          </div>
          {uploadError && (
            <p className="mt-2 text-sm text-accent-coral">{uploadError}</p>
          )}
          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Food listing ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-accent-coral text-white rounded-full p-1 hover:bg-accent-coral/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting || uploadingImage}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
};