import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/lib/auth';
import { PlacesAutocomplete } from '@/components/ui/places-autocomplete';
import { ErrorMessage } from '@/components/ui/error';
import { getErrorMessage } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  operatingHours: z.string().min(1, 'Operating hours are required'),
  pickupInstructions: z.string().min(1, 'Pickup instructions are required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') as UserRole;
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      address: '',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!userType) {
      console.error('User type not specified');
      return;
    }

    setIsSubmitting(true);
    setAuthError('');

    try {
      await signUp(
        data.email,
        data.password,
        userType,
        data.name,
        data.address,
        data.phone,
        data.contactPerson,
        data.operatingHours,
        data.pickupInstructions
      );
      
      navigate('/dashboard');
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userType || (userType !== 'restaurant' && userType !== 'ngo')) {
    return (
      <div className="min-h-screen bg-primary-beige flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-charcoal mb-4">Get Started with FeedConnect – Connect, Share, Grow!</h2>
          <p className="text-neutral-charcoal/80">Please select a valid user type to register.</p>
          <div className="mt-8 space-x-4">
            <Button onClick={() => navigate('/register?type=restaurant')}>
              Register as Restaurant
            </Button>
            <Button onClick={() => navigate('/register?type=ngo')} variant="secondary">
              Register as NGO
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-beige py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-neutral-charcoal">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-charcoal/80">
            Registering as {userType === 'restaurant' ? 'a Restaurant' : 'an NGO'}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {authError && (
            <div className="bg-accent-coral/10 border border-accent-coral text-accent-coral px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{authError}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-neutral-charcoal">Account Information</h3>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-charcoal">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register('password')}
                    className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-[13px] text-neutral-charcoal/60 hover:text-neutral-charcoal focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-charcoal">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-[13px] text-neutral-charcoal/60 hover:text-neutral-charcoal focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-neutral-charcoal">Profile Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-charcoal">
                  {userType === 'restaurant' ? 'Restaurant Name' : 'Organization Name'}
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
                <label htmlFor="address" className="block text-sm font-medium text-neutral-charcoal">
                  Address
                </label>
                <PlacesAutocomplete
                  value={watch('address')}
                  onChange={(value) => setValue('address', value)}
                  error={!!errors.address}
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
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-neutral-charcoal">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  {...register('contactPerson')}
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="operatingHours" className="block text-sm font-medium text-neutral-charcoal">
                  Operating Hours
                </label>
                <textarea
                  id="operatingHours"
                  rows={2}
                  {...register('operatingHours')}
                  placeholder="e.g., Mon-Fri: 9 AM - 10 PM, Sat-Sun: 10 AM - 11 PM"
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
                />
                {errors.operatingHours && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.operatingHours.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="pickupInstructions" className="block text-sm font-medium text-neutral-charcoal">
                  Pickup Instructions
                </label>
                <textarea
                  id="pickupInstructions"
                  rows={3}
                  {...register('pickupInstructions')}
                  placeholder="Special instructions for food pickup"
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2"
                />
                {errors.pickupInstructions && (
                  <p className="mt-1 text-sm text-accent-coral">{errors.pickupInstructions.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};