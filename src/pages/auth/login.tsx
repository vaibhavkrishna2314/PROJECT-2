import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/error';
import { getErrorMessage } from '@/lib/utils';
import bgImage from '@/images/frame-with-dogs-vector-white-background_53876-127700.avif';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError('');
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      setAuthError(getErrorMessage(error));
    }
  };

  return (
    <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  style={{ backgroundImage: `url(${bgImage})` }}
>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral-charcoal">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-charcoal/80">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-primary-green hover:text-primary-green/80">
              Register here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {authError && (
            <div className="bg-accent-coral/10 border border-accent-coral text-accent-coral px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{authError}</span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 text-neutral-charcoal shadow-sm focus:border-primary-green focus:outline-none focus:ring-1 focus:ring-primary-green"
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
                  autoComplete="current-password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border border-neutral-light px-3 py-2 pr-10 text-neutral-charcoal shadow-sm focus:border-primary-green focus:outline-none focus:ring-1 focus:ring-primary-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-[13px] text-neutral-charcoal/60 hover:text-neutral-charcoal focus:outline-none "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-accent-coral">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};